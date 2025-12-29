"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analyzer = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const { Parser, Language } = require('web-tree-sitter');
class Analyzer {
    constructor() { }
    async initialize() {
        console.log('Analyzer: Initializing web-tree-sitter...');
        try {
            await Parser.init();
            console.log('Analyzer: web-tree-sitter initialized.');
            this.parser = new Parser();
            const langFile = __dirname + '/../tree-sitter-awk.wasm';
            const Lang = await Language.load(langFile);
            this.parser.setLanguage(Lang);
            console.log('Analyzer: AWK Language loaded from WASM.');
        }
        catch (e) {
            console.error('Analyzer: Failed to initialize:', e);
            throw e;
        }
    }
    analyze(text) {
        if (!this.parser) {
            return undefined;
        }
        return this.parser.parse(text);
    }
}
exports.Analyzer = Analyzer;
//# sourceMappingURL=analyzer.js.map