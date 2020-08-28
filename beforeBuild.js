'use strict'

const cp = require('child_process');
const rimraf = require('rimraf');
const process = require('process');

// Rebuild native modules for ia32 and run webpack again for the ia32 part of windows packages
exports.default = function(context) {
        if (context.platform.name === 'windows') {
		// Remove all ext2fs built files
		rimraf.sync('node_modules/ext2fs/build');
		rimraf.sync('node_modules/ext2fs/deps/e2fsprogs/**/*.[ao]');
		// Rebuild all native modules
                cp.execFileSync(
                        'bash',
                        ['./node_modules/.bin/electron-rebuild', '--types', 'dev', '--arch', context.arch],
                );
		rimraf.sync('generated');
                cp.execFileSync(
                        'bash',
                        ['./node_modules/.bin/webpack'],
			{
				env: {
					...process.env,
					npm_config_target_arch: context.arch,
				},
			},
                );
        }
}
