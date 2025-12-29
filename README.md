# SAWK - Smart AWK

<div align="center">
<img src="https://raw.githubusercontent.com/Nader7x/SAWK/main/images/icon.png" width="200" height="200" alt="SAWK Logo" />

**Professional-grade AWK development for VS Code.**

</div>

---

**SAWK** makes writing AWK scripts powerful and easy. Whether you are writing standalone `.awk` files or one-liners inside your Bash scripts, SAWK provides the modern tooling you expect.

## ✨ Features

### 🧠 IntelliSense & Language Server

- **Autocomplete**: Smart suggestions for AWK built-ins (`FS`, `NF`, `print`, `printf`) and your own user-defined functions and variables.
- **Hover Documentation**: View documentation for built-in keywords and definitions for your own symbols just by hovering.
- **Diagnostics**: Real-time syntax error reporting powered by `tree-sitter` for robust parsing.

### 🔌 Inline AWK Highlighting

Stop writing black-and-white code in your shell scripts!
SAWK automatically highlights `awk` code inside your bash/shell files:

```bash
# This code block will be highlighted as AWK!
awk 'BEGIN { print "Hello from embedded AWK" }' file.txt
```

### 🏎️ High Performance

- **WASM-Powered**: Runs anywhere (Windows, Linux, macOS) without native dependencies.
- **Optimized Bundle**: Starts instantly and barely touches your disk (< 1MB).

## 🚀 Installation

1. Open **VS Code**.
2. Go to the **Extensions** view (`Ctrl+Shift+X`).
3. Search for `SAWK`.
4. Click **Install**.

## 🤝 Contributing

This project is open source and available on [GitHub](https://github.com/Nader7x/SAWK).
Issues and feature requests are welcome!

**Enjoy coding with SAWK!** 🦅
