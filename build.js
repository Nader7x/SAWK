const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',
	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}`);
			});
			console.log('[watch] build finished');
		});
	},
};

async function main() {
	const ctxClient = await esbuild.context({
		entryPoints: ['client/src/extension.ts'],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'client/dist/extension.js',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [
			/* add to the end of plugins array */
			esbuildProblemMatcherPlugin,
		],
	});

	const ctxServer = await esbuild.context({
		entryPoints: ['server/src/server.ts'],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'server/dist/server.js',
		external: ['vscode'],
        // web-tree-sitter dynamic require might need handling or it bundles fine.
        // We will bundle it to avoid shipping node_modules.
		logLevel: 'silent',
		plugins: [
			/* add to the end of plugins array */
			esbuildProblemMatcherPlugin,
		],
	});

	if (watch) {
		await ctxClient.watch();
		await ctxServer.watch();
	} else {
		await ctxClient.rebuild();
		await ctxServer.rebuild();
		await ctxClient.dispose();
		await ctxServer.dispose();
        
        // Copy WASM files to dist
        console.log('Copying WASM files...');
        fs.copyFileSync(
            'server/node_modules/web-tree-sitter/web-tree-sitter.wasm',
            'server/dist/web-tree-sitter.wasm'
        );
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
