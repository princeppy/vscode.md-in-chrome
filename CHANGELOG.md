# Changelog

All notable changes to **Open Markdown in Chrome** will be documented here.

## [0.0.3]

- Added support for `.html` files (previously `.md` only)
- Added `Alt+B` keyboard shortcut to open the focused Markdown/HTML file in Chrome
- Added cross-platform support: Windows (`start chrome`) and Linux (`google-chrome`, falls back to `chromium`)
- Added editor context menu, editor tab context menu, and editor title-bar icon entries
- Command handler now falls back to the active editor when no URI is provided (enables keybinding and title-bar icon)

## [0.0.1] — Initial Release

- Right-click any `.md` file in the VSCode Explorer to open it in Google Chrome via `open -a`
- Configurable browser app name via `md-in-chrome.browserApp` setting
- Informative error messages with a direct "Open Settings" action button
- Guards against missing files and misconfigured browser names
