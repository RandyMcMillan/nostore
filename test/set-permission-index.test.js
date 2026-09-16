/**
 * B2 regression — setPermission(host, action, perm, index) index-0 leak.
 *
 * setPermission() falls back to the ACTIVE profile only when no explicit index
 * is passed. The old guard `if (!index)` treated profile index 0 as "unset", so
 * a grant explicitly targeted at profile 0 silently wrote to whatever profile
 * was currently active. The fix uses `if (index == null)` so 0 is respected.
 *
 * Exercises the REAL src/utilities/utils.js seam via the fake-chrome harness,
 * following the pattern in test/active-profile-switch.test.js.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { installFakeChrome, flushStorageWrites } from './helpers/fake-chrome.js';

const UTILS = '../src/utilities/utils.js';

function makeProfile(name, overrides = {}) {
    return {
        name,
        privKey: '',
        pubKey: '',
        hosts: {},
        relays: [],
        relayReminder: false,
        type: 'local',
        bunkerUrl: null,
        remotePubkey: null,
        updatedAt: Math.floor(Date.now() / 1000),
        ...overrides,
    };
}

afterEach(() => {
    delete globalThis.chrome;
    delete globalThis.browser;
});

describe('B2 — setPermission respects an explicit profile index of 0', () => {
    it('a grant targeted at profile 0 writes to profile 0, not the active profile', async () => {
        vi.resetModules();
        const { local } = installFakeChrome();
        // Profile 1 (Bob) is the ACTIVE profile; the grant is aimed at profile 0.
        await local.set({
            profiles: [makeProfile('Alice'), makeProfile('Bob')],
            profileIndex: 1,
        });

        const { setPermission, getProfiles } = await import(UTILS);

        await setPermission('https://snort.social', 'signEvent', 'always', 0);
        await flushStorageWrites();

        const profiles = await getProfiles();
        // The grant landed on profile 0 (Alice)...
        expect(profiles[0].hosts['https://snort.social']).toEqual({ signEvent: 'always' });
        // ...and NOT on the active profile 1 (Bob).
        expect(profiles[1].hosts['https://snort.social']).toBeUndefined();
    });

    it('with no index it still falls back to the active profile', async () => {
        vi.resetModules();
        const { local } = installFakeChrome();
        await local.set({
            profiles: [makeProfile('Alice'), makeProfile('Bob')],
            profileIndex: 1,
        });

        const { setPermission, getProfiles } = await import(UTILS);

        // Omitting index → active profile (index 1 / Bob).
        await setPermission('https://iris.to', 'signEvent', 'session');
        await flushStorageWrites();

        const profiles = await getProfiles();
        expect(profiles[1].hosts['https://iris.to']).toEqual({ signEvent: 'session' });
        expect(profiles[0].hosts['https://iris.to']).toBeUndefined();
    });

    it('an explicit non-zero index is honored', async () => {
        vi.resetModules();
        const { local } = installFakeChrome();
        await local.set({
            profiles: [makeProfile('Alice'), makeProfile('Bob'), makeProfile('Carol')],
            profileIndex: 0,
        });

        const { setPermission, getProfiles } = await import(UTILS);

        await setPermission('https://primal.net', 'getPubKey', 'always', 2);
        await flushStorageWrites();

        const profiles = await getProfiles();
        expect(profiles[2].hosts['https://primal.net']).toEqual({ getPubKey: 'always' });
        expect(profiles[0].hosts['https://primal.net']).toBeUndefined();
    });
});
