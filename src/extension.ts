import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "O" is now active!');

	let disposable = vscode.commands.registerCommand('O.helloWorld', () => {
		
		vscode.window.showInformationMessage('O!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
