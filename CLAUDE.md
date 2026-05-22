# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

VS Code extension that adds a single Explorer context-menu command, **Open in Chrome**, for `.md` files. On macOS it shells out to `open -a "<browserApp>" "<file>"` to hand the file to Chrome (or any Chromium-based browser configured via the `md-in-chrome.browserApp` setting).

**Platform constraint:** macOS only — the implementation depends on the macOS `open` command. Any cross-platform support would require branching on `process.platform` and using `start` (Windows) / `xdg-open` (Linux).

## Commands

- `npm run compile` — Type-check and emit JS to `out/` (entry: `out/extension.js`).
- `npm run watch` — Incremental `tsc -watch`. Use during development; VS Code's Extension Host (F5) reloads from `out/`.
- `npx vsce package` — Build a `.vsix` (output already committed: `md-in-chrome-0.0.2.vsix`). Runs `vscode:prepublish` → `compile`.
- Manual test: open the project in VS Code → press F5 → in the new Extension Development Host window, right-click any `.md` in the Explorer → **Open in Chrome**.

There is no test runner, linter, or formatter configured in this repo.

## Architecture

Single-file extension (`src/extension.ts`) — there is no module split worth navigating.

- `activate()` registers the `md-in-chrome.openInChrome` command. `activationEvents` is empty; activation happens lazily on first command invocation (VS Code ≥1.74 auto-derives activation from `contributes.commands`).
- The command is **context-menu-only**: `package.json` hides it from the Command Palette (`"when": "false"`) and shows it in `explorer/context` only when `resourceExtname == .md && !explorerResourceIsFolder`. The handler still receives the `vscode.Uri` from the menu invocation and guards defensively against a missing URI and a missing file on disk.
- The shell-out uses `execFile("open", ["-a", browserApp, fsPath], …)` — argv form, not `exec`, so `browserApp` and `fsPath` are not subject to shell interpolation even though `browserApp` is user-configurable.
- Error path surfaces `stderr` (or the Error message) in a `showErrorMessage` with an **Open Settings** action that deep-links to the `md-in-chrome.browserApp` setting via `workbench.action.openSettings`.

## Configuration surface

`md-in-chrome.browserApp` (string, default `"Google Chrome"`, scope `machine`) — the exact `.app` bundle name without `.app`, passed straight to `open -a`. Changing it is how users target Chrome Canary, Chromium, Edge, etc.

## Conventions specific to this repo

- Compile output (`out/`) is gitignored but required at runtime; always run `npm run compile` (or have `watch` running) before launching the Extension Host.
- Bump `version` in `package.json` and add a `CHANGELOG.md` entry before re-packaging a `.vsix`.
