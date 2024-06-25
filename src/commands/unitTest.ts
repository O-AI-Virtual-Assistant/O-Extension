import * as vscode from 'vscode';

export const unitTest = () => {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse('http://localhost:3000'));
};