import * as vscode from "vscode";
import * as fs from "fs";
import { execFile } from "child_process";

export function activate(context: vscode.ExtensionContext): void {
  const command = vscode.commands.registerCommand(
    "md-in-chrome.openInChrome",
    (uri: vscode.Uri) => {
      openMarkdownInChrome(uri);
    },
  );

  context.subscriptions.push(command);
}

export function deactivate(): void {
  // Nothing to clean up.
}

function openMarkdownInChrome(uri: vscode.Uri): void {
  // Guard: uri must be present. Since this command is context-menu-only,
  // VSCode always passes it — but we guard defensively.
  if (!uri || !uri.fsPath) {
    vscode.window.showErrorMessage(
      "Open in Chrome: No file path was provided. Please right-click a Markdown file in the Explorer.",
    );
    return;
  }

  const fsPath = uri.fsPath;

  // Guard: confirm the file exists on disk before invoking `open`.
  // A file can disappear between the Explorer rendering it and the command firing.
  if (!fs.existsSync(fsPath)) {
    vscode.window.showErrorMessage(
      `Open in Chrome: File not found on disk — ${fsPath}`,
    );
    return;
  }

  // Read the configurable browser app name.
  const config = vscode.workspace.getConfiguration("md-in-chrome");
  const browserApp = config.get<string>("browserApp", "Google Chrome");

  // Invoke `open -a "<browserApp>" "<filePath>"` via execFile (no shell interpolation).
  execFile("open", ["-a", browserApp, fsPath], (error, _stdout, stderr) => {
    if (error) {
      const detail = stderr?.trim() || error.message;

      // Show the error with an action button to jump directly to the setting.
      vscode.window
        .showErrorMessage(
          `Open in Chrome: Failed to open the file. Check the 'md-in-chrome.browserApp' setting.\n\n${detail}`,
          "Open Settings",
        )
        .then((selection) => {
          if (selection === "Open Settings") {
            vscode.commands.executeCommand(
              "workbench.action.openSettings",
              "md-in-chrome.browserApp",
            );
          }
        });
    }
  });
}
