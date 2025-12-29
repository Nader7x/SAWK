# SAWK Project Roadmap

This document outlines the strategic plan for the SAWK extension, focusing on moving from a basic language server to a professional-grade development tool.

## 🚀 version 0.1.0: The "Editor" Update (Next Release)

_Focus: Improving the core editing experience._

- [ ] **Formatting Support**
  - Implement `DocumentFormattingEditProvider`.
  - Support external formatters (e.g., `gawk -o-`, `awk-fmt`).
  - Basic indentation logic if no external tool is found.
- [ ] **Run Capabilities**
  - Right-click context menu: "Run AWK Script".
  - CodeLens: "Run" button above `BEGIN` or matches.
  - Output to a dedicated "SAWK Output" terminal.
- [ ] **Linter Integration**
  - Move beyond syntax errors. Note potential runtime issues (e.g., usage of uninitialized variables).

## ⚡ version 0.2.0: The "Killer Feature" Update

_Focus: Inline Intelligence._

- [ ] **Inline LSP Support (The Big One)**
  - **Goal**: Provide Completion and Hover _inside_ bash/shell scripts, not just in `.awk` files.
  - **Challenge**: VS Code doesn't natively forward LSP requests from embedded regions easily.
  - **Strategy**:
    1. Client (Extension) detects cursor inside `awk '...'` in a shell file.
    2. Client extracts the AWK content as a virtual document.
    3. Client forwards the request (Completion/Hover) to the SAWK Server.
    4. Client maps the returned positions back to the original shell file.

## 🧠 version 0.3.0: Advanced Intelligence

_Focus: Deep code understanding._

- [ ] **Rename Symbol**
  - Rename variables and functions across the file.
- [ ] **Find All References**
  - Click a function to see everywhere it is called.
- [ ] **Go to Definition**
  - Jump to where a function or variable is defined.
- [ ] **Signature Help**
  - Show parameters when typing a function call: `myFunc(param1, param2)`.

## 🛡️ version 1.0.0: Stability & Ecosystem

_Focus: Production readiness._

- [ ] **Cross-Platform CI/CD**
  - Automated tests on Windows, Linux, and macOS via GitHub Actions.
- [ ] **Unit Testing Suite**
  - Comprehensive tests for the Parser and Symbol Table.
- [ ] **Configuration UI**
  - Graphical settings for paths, formatter preferences, and linting rules.

## 🔮 Future Ideas (Backlog)

- **Debug Adapter Protocol (DAP)**: Step-through debugging for AWK scripts (using a modified `gawk` or wrapper).
- **Remote Development**: Full support for Remote-SSH and DevContainers.
