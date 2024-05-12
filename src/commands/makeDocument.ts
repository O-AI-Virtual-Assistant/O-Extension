import * as vscode from 'vscode';
import { Request, Response, Router } from 'express';
import { OpenAI } from 'openai';

const apiKey='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';

const openai = new OpenAI({ apiKey: apiKey });

export const makeDocumentCommand = async () => {
    const selectedText = await getSelectedText();
    if (!selectedText) {
        vscode.window.showInformationMessage('No code selected.');
        return;
    }

    let generatedDocument = await generateDocument(selectedText);
    if (!generatedDocument) {
        generatedDocument = '//lol,where is the api key?';
        vscode.window.showErrorMessage('Failed to generate document.');
        //return;
    }

    await replaceCodeWithDocument(generatedDocument);
    await displayReplacedDocument();
};

const getSelectedText = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return null;
    }

    return editor.document.getText(editor.selection);
};

export const generateDocument = async (selectedCode: string) => {
    const userMessage = 'Can you generate a document for the following code: ' + selectedCode;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        });

        const answer = response.choices.map((out) => out.message.content).join(' ');
        return answer;
    } catch (error) {
        console.log("your api key : ",apiKey);
        console.error('Error in OpenAI API request:', error);
        return null;
    }
};

export const replaceCodeWithDocument = async (documentContent: string) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return;
    }

    await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, documentContent);
    });

    vscode.window.showInformationMessage('Document generated successfully.');
};

export const displayReplacedDocument = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return;
    }

    await editor.document.save();
    vscode.window.showTextDocument(editor.document);
};
