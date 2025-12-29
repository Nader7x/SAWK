# Change Log

All notable changes to the "sawk" extension will be documented in this file.

## [0.0.1] - 2025-12-29

### Added

- **IntelliSense**: Autocomplete and Hover support for user-defined functions and AWK built-ins (FS, NF, print, etc.).
- **Inline Highlighting**: Syntax highlighting for AWK scripts inside Bash/Shell files (`awk '...'`).
- **Diagnostics**: Real-time syntax error reporting powered by tree-sitter.
- **WASM Support**: Full Windows/Linux compatibility using `web-tree-sitter`.
- **Bundled**: Optimized extension size (~280KB) for fast startup.
