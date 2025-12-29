"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTable = exports.SymbolKind = void 0;
var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["Function"] = 0] = "Function";
    SymbolKind[SymbolKind["Variable"] = 1] = "Variable";
})(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
class SymbolTable {
    constructor() {
        this.symbols = new Map();
    }
    update(uri, tree) {
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
            }
            else if (node.type === 'assignment_exp') {
                const left = node.child(0);
                if (left && left.type === 'identifier') {
                    this.addSymbol(left.text, SymbolKind.Variable, uri, left);
                }
            }
        });
    }
    get(name) {
        return this.symbols.get(name);
    }
    getAll() {
        return Array.from(this.symbols.values());
    }
    addSymbol(name, kind, uri, node) {
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
    traverse(node, callback) {
        callback(node);
        if (node.children) {
            for (const child of node.children) {
                this.traverse(child, callback);
            }
        }
    }
}
exports.SymbolTable = SymbolTable;
//# sourceMappingURL=symbols.js.map