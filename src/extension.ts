import * as vscode from "vscode";
import { HelloWorldPanel } from "./HelloWorld";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "O" is now active!');

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  item.text = "$(beaker) Ask O";
  item.show();
  item.command = "O.AskO";

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("O-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("O.helloWorld", () => {
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("O.AskO", () => {
      const { activeTextEditor } = vscode.window;

      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active editor");
        return;
      }
      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );

      if (!text) {
        vscode.window.showInformationMessage("No text selected");
        return;
      }
      vscode.window.showInformationMessage("Text: " + text);

      if (sidebarProvider._view) {
        sidebarProvider._view.webview.postMessage({
          type: "AskO",
          value: text,
        });
      }
    })
  );
}

export function deactivate() {}
