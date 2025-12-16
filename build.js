#!/usr/bin/env node

let watch =
    process.argv[2] === 'watch'
        ? {
              onRebuild(error, result) {
                  if (error) console.error('watch rebuild failed: ', error);
                  else console.log('watch rebuild succeeded: ', result);
              },
          }
        : false;

require('esbuild')
    .build({
    entryPoints: [
        'Shared (Extension)/Resources/content.js',
        'Shared (Extension)/Resources/nostr.js',
        'Shared (Extension)/Resources/popup.js',
        'Shared (Extension)/Resources/options.js',
        'Shared (Extension)/Resources/wizards/delegation/delegation.js',
        'Shared (Extension)/Resources/experimental/experimental.js',
        'Shared (Extension)/Resources/event_history/event_history.js',
        'Shared (Extension)/Resources/alpine.js'
    ],
    outdir: 'Shared (Extension)/Resources/build',
    allowOverwrite: true,
        outdir: './Shared (Extension)/Resources',
        sourcemap: 'inline',
        bundle: true,
        inject: [],
        // minify: true,
        watch,
    })
    .catch(() => process.exit(1));
