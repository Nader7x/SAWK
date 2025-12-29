"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const analyzer_1 = require("./analyzer");
const symbols_1 = require("./symbols");
// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a simple text document manager.
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
// Initialize parser
const analyzer = new analyzer_1.Analyzer();
const symbolTable = new symbols_1.SymbolTable();
let analyzerReady = false;
connection.onInitialize(async (params) => {
    const capabilities = params.capabilities;
    // Initialize the analyzer
    connection.console.log('Server: Initializing...');
    try {
        connection.console.log('Server: calling analyzer.initialize()...');
        await analyzer.initialize();
        analyzerReady = true;
        connection.console.log('Server: Analyzer active.');
    }
    catch (e) {
        connection.console.error(`Server: Failed to activate analyzer: ${e}`);
        if (e instanceof Error) {
            connection.console.error(`Stack: ${e.stack}`);
        }
    }
    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion.
            completionProvider: {
                resolveProvider: true
            },
            hoverProvider: true
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});
connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings = { maxNumberOfProblems: 1000 };
let globalSettings = defaultSettings;
// Cache the settings of all open documents
const documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.languageServerExample || defaultSettings));
    }
    // Revalidate all open text documents
    documents.all().forEach(validateTextDocument);
});
function getDocumentSettings(resource) {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: 'sawk'
        });
        documentSettings.set(resource, result);
    }
    return result;
}
// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});
async function validateTextDocument(textDocument) {
    if (!analyzerReady) {
        return;
    }
    // In this simple example we get the settings for every validate run.
    const settings = await getDocumentSettings(textDocument.uri);
    const text = textDocument.getText();
    const tree = analyzer.analyze(text);
    const diagnostics = [];
    if (tree) {
        // Update Symbol Table
        symbolTable.update(textDocument.uri, tree);
        // Traverse the tree to find errors
        traverse(tree.rootNode, (node) => {
            if (node.type === 'ERROR' || node.type === 'MISSING') {
                const diagnostic = {
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: node.startPosition.row, character: node.startPosition.column },
                        end: { line: node.endPosition.row, character: node.endPosition.column }
                    },
                    message: `Syntax error: Unexpected ${node.type}`,
                    source: 'sawk'
                };
                diagnostics.push(diagnostic);
            }
        });
    }
    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
function traverse(node, callback) {
    callback(node);
    if (node.children) {
        for (const child of node.children) {
            traverse(child, callback);
        }
    }
}
connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log('We received an file change event');
});
// Listen on the connection
connection.onHover((params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) {
        return null;
    }
    const pos = params.position;
    const text = doc.getText();
    const lines = text.split('\n');
    const line = lines[pos.line];
    // Simple word extraction around cursor
    const wordRegex = /[\w_]+/g;
    let match;
    let word = '';
    while ((match = wordRegex.exec(line)) !== null) {
        if (match.index <= pos.character && wordRegex.lastIndex >= pos.character) {
            word = match[0];
            break;
        }
    }
    if (!word) {
        return null;
    }
    // Check SymbolTable
    const symbol = symbolTable.get(word);
    if (symbol) {
        return {
            contents: {
                kind: 'markdown',
                value: `**${symbol.name}**\n\n*User Defined ${symbol.kind === 0 ? 'Function' : 'Variable'}*`
            }
        };
    }
    // Check Built-ins (Basic list)
    if (['FS', 'NF', 'NR', 'print', 'printf'].includes(word)) {
        return {
            contents: {
                kind: 'markdown',
                value: `**${word}**\n\n*AWK Built-in*\n\n[Documentation](https://www.gnu.org/software/gawk/manual/html_node/${word}.html)`
            }
        };
    }
    return null;
});
// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition) => {
    const items = [];
    // 1. Add Built-ins
    const builtIns = [
        'FS', 'NF', 'NR', 'FNR', 'OFS', 'ORS', 'RS', 'FILENAME', 'SUBSEP', 'ENVIRON',
        'print', 'printf', 'split', 'match', 'substr', 'length', 'index', 'gsub', 'sub', 'system', 'tolower', 'toupper'
    ];
    builtIns.forEach((name, i) => {
        items.push({
            label: name,
            kind: node_1.CompletionItemKind.Keyword,
            data: { type: 'builtin', name: name }
        });
    });
    // 2. Add User Symbols from SymbolTable
    const userSymbols = symbolTable.getAll();
    userSymbols.forEach(symbol => {
        items.push({
            label: symbol.name,
            kind: symbol.kind === 0 ? node_1.CompletionItemKind.Function : node_1.CompletionItemKind.Variable,
            detail: symbol.kind === 0 ? 'User Function' : 'User Variable',
            data: { type: 'user', name: symbol.name }
        });
    });
    return items;
});
// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item) => {
    if (item.data.type === 'builtin') {
        item.detail = 'AWK Built-in';
        item.documentation = `Standard AWK built-in: ${item.data.name}`;
    }
    return item;
});
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map