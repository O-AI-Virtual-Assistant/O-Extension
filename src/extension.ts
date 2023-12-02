import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorld';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "O" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('O.helloWorld', () => {
			HelloWorldPanel.createOrShow(context.extensionUri);
		})
	);

}

export function deactivate() {}
