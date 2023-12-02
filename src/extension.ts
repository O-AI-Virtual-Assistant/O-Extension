import * as vscode from "vscode";
import { HelloWorldPanel } from "./HelloWorld";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "O" is now active!');

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("O-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("O.helloWorld", () => {
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );
}

export function deactivate() {}
