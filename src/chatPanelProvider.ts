import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { apiBaseUrl } from "./constants";
import { TokenManager } from "./TokenManager";

export class ChatPanelProvider {
  static currentPanel: ChatPanelProvider | undefined;
  private readonly panel: vscode.WebviewPanel;

  static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (ChatPanelProvider.currentPanel) {
      ChatPanelProvider.currentPanel.panel.reveal(column);
    } 
    else {
      const panel = vscode.window.createWebviewPanel(
        'chat',
        'Chat with O',
        column || vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
        }
      );
      ChatPanelProvider.currentPanel = new ChatPanelProvider(panel, extensionUri);
    }
  }

  constructor(panel: vscode.WebviewPanel, private readonly extensionUri: vscode.Uri) {
    this.panel = panel;
    this.panel.onDidDispose(() => this.dispose(), null, []);

    this.panel.webview.html = this._getHtmlForWebview(this.panel.webview);

    this.panel.webview.onDidReceiveMessage(message => {
        switch (message.command) {
            case "sendMessage":
                console.log("Chat message received:", message.content);
                break;
            case "backToMenu":
                vscode.commands.executeCommand('O.backToMenu');
                break;
            // Handle other messages as necessary
            default:
                console.log("Received unknown command:", message);
        }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "vscode.css")
    );
    
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "out", "compiled/Chat.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "out", "compiled/Chat.js")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleResetUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          const vscode = acquireVsCodeApi();
        </script>
      </head>
      <body>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }

  public dispose() {
    ChatPanelProvider.currentPanel = undefined;
    this.panel.dispose();
  }
}
