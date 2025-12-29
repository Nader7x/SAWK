/* eslint-disable @typescript-eslint/no-var-requires */
const { Parser, Language } = require('web-tree-sitter');

export class Analyzer {
    private parser?: any;

    constructor() {}

    public async initialize(): Promise<void> {
        console.log('Analyzer: Initializing web-tree-sitter...');
        try {
            await Parser.init({
                locateFile: () => __dirname + '/web-tree-sitter.wasm',
            });
            console.log('Analyzer: web-tree-sitter initialized.');
            
            this.parser = new Parser();
            const langFile = __dirname + '/../tree-sitter-awk.wasm';
            const Lang = await Language.load(langFile);
            this.parser.setLanguage(Lang);
            console.log('Analyzer: AWK Language loaded from WASM.');
        } catch (e) {
            console.error('Analyzer: Failed to initialize:', e);
            throw e;
        }
    }

    public analyze(text: string): any {
        if (!this.parser) {
            return undefined;
        }
        return this.parser.parse(text);
    }
}
