import * as vscode from "vscode";
import { HelloWorldPanel } from "./HelloWorld";
import { SidebarProvider } from "./SidebarProvider";
import { unitTest } from "./unitTest";
import { authenticate } from "./authenticate";
import { TokenManager } from "./TokenManager";
import { makeDocumentCommand } from './commands/makeDocument';
import { findCodeSmellCommand } from "./commands/findcodesmell";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "O" is now active!');
  TokenManager.globalState = context.globalState;

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
    vscode.commands.registerCommand("O.authenticate", () => {
      authenticate();
    })
  );
  
  context.subscriptions.push(
    vscode.commands.registerCommand("O.unitTest", () => {
      unitTest();
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

  context.subscriptions.push(
    vscode.commands.registerCommand("O.makeDocument", makeDocumentCommand)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("O.findCodeSmells", findCodeSmellCommand)
  );
}


export function deactivate() {}
