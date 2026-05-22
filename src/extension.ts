import * as vscode from "vscode";
import * as fs from "fs";
import { execFile, ExecFileException } from "child_process";

export function activate(context: vscode.ExtensionContext): void {
  const command = vscode.commands.registerCommand(
    "md-in-chrome.openInChrome",
    (uri?: vscode.Uri) => {
      const target = uri ?? vscode.window.activeTextEditor?.document.uri;
      openInChrome(target);
    },
  );

  context.subscriptions.push(command);
}

export function deactivate(): void {
  // Nothing to clean up.
}

function openInChrome(uri: vscode.Uri | undefined): void {
  if (!uri || !uri.fsPath) {
    vscode.window.showErrorMessage(
      "Open in Chrome: No file path was provided. Right-click a Markdown or HTML file, or focus its editor and press Alt+B.",
    );
    return;
  }

  const fsPath = uri.fsPath;

  if (!fs.existsSync(fsPath)) {
    vscode.window.showErrorMessage(
      `Open in Chrome: File not found on disk — ${fsPath}`,
    );
    return;
  }

  launchChrome(fsPath, (error, stderr) => {
    if (!error) {
      return;
    }
    const detail = stderr?.trim() || error.message;
    vscode.window
      .showErrorMessage(
        `Open in Chrome: Failed to open the file.\n\n${detail}`,
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
  });
}

type LaunchCallback = (
  error: ExecFileException | null,
  stderr?: string,
) => void;

function launchChrome(fsPath: string, callback: LaunchCallback): void {
  const platform = process.platform;

  if (platform === "darwin") {
    const config = vscode.workspace.getConfiguration("md-in-chrome");
    const browserApp = config.get<string>("browserApp", "Google Chrome");
    execFile("open", ["-a", browserApp, fsPath], (error, _stdout, stderr) => {
      callback(error, stderr);
    });
    return;
  }

  if (platform === "win32") {
    // `start` is a cmd builtin. The empty "" is the window title argument
    // required when the first quoted token would otherwise be treated as one.
    execFile(
      "cmd",
      ["/c", "start", "", "chrome", fsPath],
      (error, _stdout, stderr) => {
        callback(error, stderr);
      },
    );
    return;
  }

  // Linux: try google-chrome, fall back to chromium.
  execFile("google-chrome", [fsPath], (error, _stdout, stderr) => {
    if (!error) {
      callback(null);
      return;
    }
    execFile("chromium", [fsPath], (fallbackError, _out, fallbackStderr) => {
      callback(fallbackError, fallbackStderr || stderr);
    });
  });
}
