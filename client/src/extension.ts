import * as path from 'path';
import { workspace, ExtensionContext, window } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	// Create output channel for client logs
    const extensionOutputChannel = window.createOutputChannel('SAWK Extension');
    extensionOutputChannel.show(true);
    extensionOutputChannel.appendLine(`SAWK Extension: Activating...`);

	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('server', 'dist', 'server.js')
	);
    extensionOutputChannel.appendLine(`SAWK Extension: Server module path: ${serverModule}`);

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for awk documents
		documentSelector: [{ scheme: 'file', language: 'awk' }],
        // outputChannel: extensionOutputChannel, // Commented out to let Client create its own "SAWK Language Server" channel
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
        // errorHandler removed to fix type issues
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'sawk',
		'SAWK Language Server',
		serverOptions,
		clientOptions
	);

    extensionOutputChannel.appendLine(`SAWK Extension: Starting client...`);
	// Start the client. This will also launch the server
	client.start().then(() => {
        extensionOutputChannel.appendLine(`SAWK Extension: Client started successfully.`);
    }).catch(e => {
        extensionOutputChannel.appendLine(`SAWK Extension: Client failed to start: ${e}`);
    });
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
