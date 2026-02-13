# Open Markdown in Chrome

**Right-click any Markdown file in the VSCode Explorer and open it instantly in Google Chrome.**

No configuration needed to get started. One click, zero friction.

---

## How It Works

This extension adds a single context menu item — **Open in Chrome** — to any `.md` file in the Explorer panel. When clicked, it runs the macOS `open -a` command under the hood, sending your file directly to Chrome exactly as if you had typed:

```bash
open -a "Google Chrome" /path/to/your/file.md
```

Chrome receives a `file://` URI and handles the file natively. If you have a Markdown rendering extension installed in Chrome (such as [Markdown Viewer](https://chrome.google.com/webstore/detail/markdown-viewer/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)), it will render the file beautifully — and auto-reload it every time you save from VSCode.

---

## Usage

1. Open any folder containing `.md` files in VSCode
2. In the **Explorer** panel, right-click any `.md` file
3. Select **Open in Chrome** from the context menu

![Context menu screenshot showing Open in Chrome option](https://raw.githubusercontent.com/com-princepy/md-in-chrome/main/images/context-menu.png)

That's it. Chrome opens (or focuses an existing window) and loads your file.

---

## Requirements

- **macOS only** — this extension uses the macOS `open` command
- **Google Chrome** installed (or see [Configuration](#configuration) to use a different browser)
- Recommended: A Chrome Markdown extension to render `.md` files as HTML

### Recommended Chrome Extension

For the best experience, install **[Markdown Viewer](https://chrome.google.com/webstore/detail/markdown-viewer/ckkdlimhmcjmikdlpkmbgfkaikojcbjk)** in Chrome, then:

1. Go to `chrome://extensions`
2. Find Markdown Viewer → click **Details**
3. Enable **Allow access to file URLs**

Chrome will now render any `file:///*.md` URL as formatted Markdown with live reload on save.

---

## Configuration

Open **Settings** (`⌘,`) and search for `md-in-chrome`, or edit your `settings.json` directly.

| Setting | Default | Description |
|---|---|---|
| `md-in-chrome.browserApp` | `"Google Chrome"` | The macOS app name passed to `open -a`. Change this to use a different browser. |

### Examples

**Use Chrome Canary instead of stable Chrome:**
```json
"md-in-chrome.browserApp": "Google Chrome Canary"
```

**Use Chromium:**
```json
"md-in-chrome.browserApp": "Chromium"
```

**Use Microsoft Edge:**
```json
"md-in-chrome.browserApp": "Microsoft Edge"
```

> **Note:** The value must match the exact `.app` bundle name as it appears in your `/Applications` folder, without the `.app` suffix.

---

## Troubleshooting

### "Failed to open the file" error

This means the `open -a` command failed — most commonly because the browser app name in your settings doesn't match an installed application.

1. Click **Open Settings** in the error notification
2. Verify `md-in-chrome.browserApp` matches your installed browser name exactly
3. Check that the app exists in `/Applications/` — for example, `/Applications/Google Chrome.app`

### The file opens but renders as plain text

Chrome does not natively render Markdown. You need a Chrome extension that intercepts `file://` URIs and renders them. See [Recommended Chrome Extension](#recommended-chrome-extension) above.

### The context menu item doesn't appear

- Confirm the file has a `.md` extension
- Make sure you're right-clicking in the **Explorer** panel (the file tree), not in the editor tab bar or the editor itself

---

## Why This Extension?

VSCode's built-in Markdown preview is great for quick checks, but it doesn't behave like a real browser. If you're writing documentation, README files, or anything destined for GitHub or a static site, previewing it in Chrome gives you the most accurate representation of how it will actually look — including your own CSS, Chrome extensions, and browser rendering quirks.

This extension removes the friction of manually navigating to a file in Chrome. Right-click → done.

---

## License

[MIT](LICENSE)
