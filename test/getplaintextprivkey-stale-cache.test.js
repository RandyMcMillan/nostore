/**
 * B1 regression — getPlaintextPrivKey() stale-session-cache pubkey guard.
 *
 * LOGIC MIRROR of the password-blob path in src/background.js getPlaintextPrivKey().
 * background.js is a service worker with import-time side effects and is not
 * cleanly importable, so this file re-implements the exact guard branch verbatim
 * (same pattern as test/consent-locked-state.test.js) and exercises it with the
 * REAL getPublicKeySync from nostr-crypto-utils, so the pubkey comparison is
 * genuine rather than mocked.
 *
 * THE BUG: sessionKeys is a Map keyed by profile INDEX. deleteProfile() splices
 * the profiles array WITHOUT reindexing sessionKeys, so after a mid-list delete
 * `sessionKeys.get(index)` can return a DIFFERENT identity's key. The old code
 * returned it unconditionally → signing with the wrong key. The guard verifies
 * the cached key derives THIS profile's cached pubKey before trusting it, and on
 * any mismatch/doubt MISSES the cache (never returns a wrong-identity key).
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { getPublicKeySync } from 'nostr-crypto-utils';
import { installFakeChrome } from './helpers/fake-chrome.js';
import { encrypt, hashPassword } from '../src/utilities/crypto.js';

const here = dirname(fileURLToPath(import.meta.url));
const V = JSON.parse(readFileSync(join(here, 'vectors', 'nostr-vectors.json'), 'utf8'));
const alice = V.keypairs.alice; // privateKey -> xonlyPubkey
const bob = V.keypairs.bob;

// ── Verbatim mirror of the password-blob branch in getPlaintextPrivKey ──────
// (device-key and plaintext tiers are elided; this test only covers the
//  isEncryptedBlob(...) + sessionKeys path, which is the one B1 hardens.)
function plaintextFromSessionCache(sessionKeys, index, profile) {
    if (sessionKeys.has(index)) {
        const cached = sessionKeys.get(index);
        // Only a POSITIVE mismatch (profile has a cached pubKey and it does not
        // match the cached key's derived pubkey) proves the entry is stale.
        if (profile.pubKey) {
            let derived = null;
            try {
                derived = getPublicKeySync(cached);
            } catch (e) {
                derived = null;
            }
            if (derived !== profile.pubKey) {
                sessionKeys.delete(index);
                throw new Error('Extension is locked — cannot access private key');
            }
        }
        return cached;
    }
    throw new Error('Extension is locked — cannot access private key');
}

describe('B1 — getPlaintextPrivKey password-blob cache pubkey guard', () => {
    it('returns the cached key when it derives the profile pubkey (happy path)', () => {
        const sessionKeys = new Map([[0, alice.privateKey]]);
        const profile = { pubKey: alice.xonlyPubkey };

        expect(plaintextFromSessionCache(sessionKeys, 0, profile)).toBe(alice.privateKey);
    });

    it('does NOT return a stale cache entry belonging to a different identity', () => {
        // Simulates a mid-list deleteProfile: the entry at index 0 is still
        // alice's key, but index 0 now holds BOB's profile (bob.pubKey).
        const sessionKeys = new Map([[0, alice.privateKey]]);
        const bobProfileNowAtIndex0 = { pubKey: bob.xonlyPubkey };

        expect(() => plaintextFromSessionCache(sessionKeys, 0, bobProfileNowAtIndex0))
            .toThrow(/locked/i);
        // Critically: it never returned alice's key for bob's profile...
        // ...and the stale entry was dropped so it can't be trusted later either.
        expect(sessionKeys.has(0)).toBe(false);
    });

    it('cannot detect a mismatch with no pubKey, so it preserves prior behavior (legacy/parked resume)', () => {
        // A profile with no cached pubKey (e.g. a session parked under an older
        // build) gives us nothing to verify against. We cannot PROVE the entry is
        // stale, so we return the cached key exactly as before — this keeps
        // read-only session resume working. The delete-shift attack is still
        // covered, because a real shifted-in profile always has its pubKey cached.
        const sessionKeys = new Map([[0, alice.privateKey]]);
        const profileNoPubkey = { pubKey: '' };

        expect(plaintextFromSessionCache(sessionKeys, 0, profileNoPubkey)).toBe(alice.privateKey);
    });

    it('misses the cache when there is no entry at the index', () => {
        const sessionKeys = new Map();
        const profile = { pubKey: alice.xonlyPubkey };

        expect(() => plaintextFromSessionCache(sessionKeys, 3, profile))
            .toThrow(/locked/i);
    });

    it('guards the exact index a delete shifted: correct index still resolves', () => {
        // Before delete: [alice@0, bob@1]. After deleting index 0, bob shifts to
        // index 0 but sessionKeys still maps {0: alice, 1: bob}. Asking for bob's
        // key at his NEW index 0 must not hand back alice's cached key.
        const sessionKeys = new Map([[0, alice.privateKey], [1, bob.privateKey]]);
        const bobAtNewIndex0 = { pubKey: bob.xonlyPubkey };

        expect(() => plaintextFromSessionCache(sessionKeys, 0, bobAtNewIndex0))
            .toThrow(/locked/i);
        expect(sessionKeys.has(0)).toBe(false);
    });
});

// ── End-to-end: the restore-loop co-population that keeps the B1 guard armed ──
// The guard above can only reject a stale entry when the profile carries a
// pubKey. Every sessionKeys writer co-populates pubKey EXCEPT backup.import,
// which cached keys from a restored backup verbatim — a pre-pubKey-caching
// backup left pubKey='' beside a populated sessionKeys entry, so a later
// mid-list deleteProfile (which does NOT reindex the index-keyed sessionKeys)
// could sign as the shifted-in profile with the WRONG cached key. This drives
// the REAL background worker to prove the whole chain is closed.
//
// RED WITHOUT the restore-loop fix: the restored profiles keep pubKey='', so
// after the delete the guard is skipped and getNsec(0) returns ALICE's nsec.
// GREEN WITH it: restored profiles get a pubKey, the guard fires, getNsec(0)
// refuses (returns null) rather than hand back a wrong-identity key.

const PASSWORD = 'correct horse battery staple';
const HEX_A = '1111111111111111111111111111111111111111111111111111111111111111';
const HEX_B = '2222222222222222222222222222222222222222222222222222222222222222';

async function settle(ticks = 12) {
    for (let i = 0; i < ticks; i++) await new Promise(r => setTimeout(r, 0));
}

async function bootBackground({ seedLocal = {}, session = false } = {}) {
    vi.resetModules();
    const env = installFakeChrome({ session, alarms: true });
    env.local._seed(seedLocal);
    env.setSendMessage((msg) => env.dispatch(msg));
    await import('../src/background.js');
    await settle();
    return env;
}

async function passwordVault(extra = {}) {
    const { hash, salt } = await hashPassword(PASSWORD);
    return {
        isEncrypted: true,
        passwordHash: hash,
        passwordSalt: salt,
        autoLockMinutes: 0,
        profileIndex: 0,
        ...extra,
    };
}

// A restored backup profile with an encrypted-blob key and NO cached pubKey —
// the exact pre-pubKey-caching shape the fix has to repair.
function legacyProfile(name, privKeyBlob) {
    return { name, privKey: privKeyBlob, pubKey: '', hosts: {}, relays: [], type: 'local' };
}

describe('B1 restore path — backup.import co-populates pubKey so the guard stays armed', () => {
    afterEach(() => {
        delete globalThis.chrome;
        delete globalThis.browser;
    });

    async function importPreFixBackup() {
        // Two encrypted-blob profiles with pubKey='' (a pre-pubKey-caching backup).
        const data = await passwordVault({
            profiles: [
                legacyProfile('Alice', await encrypt(HEX_A, PASSWORD)),
                legacyProfile('Bob', await encrypt(HEX_B, PASSWORD)),
            ],
            profileIndex: 0,
        });
        const payloadBlob = await encrypt(JSON.stringify(data), PASSWORD);
        const envelope = {
            format: 'nostrkey-backup',
            version: 1,
            payload: JSON.parse(payloadBlob),
        };

        const env = await bootBackground({ seedLocal: {} });
        const imported = await env.dispatch({
            kind: 'backup.import',
            payload: { envelope, password: PASSWORD },
        });
        expect(imported.success).toBe(true);
        return env;
    }

    it('co-populates a non-empty pubKey for every restored profile with a cached key', async () => {
        const env = await importPreFixBackup();

        const stored = env.local._dump().profiles;
        // Invariant: no sessionKeys entry now exists without a verifiable pubKey.
        expect(stored[0].pubKey).toMatch(/^[0-9a-f]{64}$/);
        expect(stored[1].pubKey).toMatch(/^[0-9a-f]{64}$/);
        // Each pubKey actually derives from its own key (not swapped).
        expect(stored[0].pubKey).toBe(getPublicKeySync(HEX_A));
        expect(stored[1].pubKey).toBe(getPublicKeySync(HEX_B));

        // Both profiles still resolve to their OWN nsec right after restore.
        const aNsec = await env.dispatch({ kind: 'getNsec', payload: 0 });
        const bNsec = await env.dispatch({ kind: 'getNsec', payload: 1 });
        expect(aNsec).toMatch(/^nsec1/);
        expect(bNsec).toMatch(/^nsec1/);
        expect(aNsec).not.toBe(bNsec);
    });

    it('after a mid-list delete, getNsec on the shifted slot NEVER returns the wrong identity', async () => {
        const env = await importPreFixBackup();

        // Alice's nsec, so we can assert it is never handed back for Bob's slot.
        const aNsec = await env.dispatch({ kind: 'getNsec', payload: 0 });
        expect(aNsec).toMatch(/^nsec1/);

        // Simulate utils.deleteProfile(0): splice the profiles array WITHOUT
        // touching the background's index-keyed sessionKeys (the real gap).
        const profiles = env.local._dump().profiles;
        profiles.splice(0, 1);           // Bob shifts from index 1 -> index 0
        await env.local.set({ profiles, profileIndex: 0 });

        // sessionKeys still maps {0: HEX_A (Alice), 1: HEX_B (Bob)}, but profiles[0]
        // is now Bob. Asking for the key at index 0 must NOT return Alice's key.
        const shifted = await env.dispatch({ kind: 'getNsec', payload: 0 });
        expect(shifted).not.toBe(aNsec);  // never Alice's identity in Bob's slot
        expect(shifted).toBeNull();       // the guard threw -> handler returns null
    });
});
