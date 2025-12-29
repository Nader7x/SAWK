"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analyzer = void 0;
const Parser = require("tree-sitter");
const Awk = require('tree-sitter-awk');
class Analyzer {
    constructor() {
        this.parser = new Parser();
        this.parser.setLanguage(Awk);
    }
    async initialize() {
        // Native tree-sitter is synchronous and doesn't need async init, 
        // but keeping method for compatibility structure.
        return Promise.resolve();
    }
    analyze(text) {
        return this.parser.parse(text);
    }
}
exports.Analyzer = Analyzer;
//# sourceMappingURL=analyzer.js.map