type Tree = any;
type SyntaxNode = any;
import { Location, Range } from 'vscode-languageserver';

export enum SymbolKind {
    Function,
    Variable
}

export interface SymbolDefinition {
    name: string;
    kind: SymbolKind;
    location: Location;
}

export class SymbolTable {
    private symbols: Map<string, SymbolDefinition> = new Map();

    public update(uri: string, tree: Tree): void {
        this.symbols.clear(); // Simple implementation: clear per update. For multi-file, use a composite key or separate map per URI.

        this.traverse(tree.rootNode, (node) => {
            if (node.type === 'func_def') {
                const nameNode = node.childForFieldName('name');
                if (nameNode) {
                    this.addSymbol(nameNode.text, SymbolKind.Function, uri, nameNode);
                }
                
                // Add parameters
                const paramsNode = node.childForFieldName('params');
                if (paramsNode) {
                    for (const param of paramsNode.children) {
                         if (param.type === 'identifier') {
                             this.addSymbol(param.text, SymbolKind.Variable, uri, param);
                         }
                    }
                }
            } else if (node.type === 'assignment_exp') {
                 const left = node.child(0);
                 if (left && left.type === 'identifier') {
                     this.addSymbol(left.text, SymbolKind.Variable, uri, left);
                 }
            }
        });
    }

    public get(name: string): SymbolDefinition | undefined {
        return this.symbols.get(name);
    }

    public getAll(): SymbolDefinition[] {
        return Array.from(this.symbols.values());
    }

    private addSymbol(name: string, kind: SymbolKind, uri: string, node: SyntaxNode) {
        if (!this.symbols.has(name)) {
            this.symbols.set(name, {
                name,
                kind,
                location: {
                    uri,
                    range: {
                        start: { line: node.startPosition.row, character: node.startPosition.column },
                        end: { line: node.endPosition.row, character: node.endPosition.column }
                    }
                }
            });
        }
    }

    private traverse(node: SyntaxNode, callback: (node: SyntaxNode) => void) {
        callback(node);
        if (node.children) {
            for (const child of node.children) {
                this.traverse(child, callback);
            }
        }
    }
}
