import * as vscode from 'vscode';
import { OpenAI } from 'openai';
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const apiKey = "sk-proj-v7vk1qBAkYHA8fOtXhqvT3BlbkFJ8VBIdph3fJ7ya5kxDaXf";
if (!apiKey) {
  vscode.window.showErrorMessage("OpenAI API key is missing. Please set it in the .env file.");
  throw new Error("OpenAI API key is missing. Please set it in the .env file.");
}

const openai = new OpenAI({ apiKey: apiKey });

export const makeCodeSmellCommand = async () => {
    const selectedText = await getSelectedText();
    if (!selectedText) {
        vscode.window.showInformationMessage('No code selected.');
        return;
    }

    let generatedSmell = await generateCodeSmell(selectedText);
    if (!generatedSmell) {
        generatedSmell = '// Failed to generate code smell.';
        vscode.window.showErrorMessage('Failed to generate code smell.');
    }

    await replaceCodeWithSmell(generatedSmell);
    await displayReplacedSmell();
};

const getSelectedText = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return null;
    }

    return editor.document.getText(editor.selection);
};

export const generateCodeSmell = async (selectedCode: string) => {
    const userMessage = `Introduce code smells into the following code:
    ${selectedCode}

    Code smells to introduce:
    - Long Method: Add unnecessary code to make the function longer.
    - Duplicate Code: Repeat the same logic unnecessarily.
    - Comments: Add redundant comments that explain obvious code.
    - Unnecessary Variables: Introduce unnecessary variables.
    - Complexity: Add unnecessary complexity.
    - Magic Numbers: Use hard-coded numbers with no explanation.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        });

        const answer = response.choices.map((out) => out.message.content).join(' ');

        return answer;
    } catch (error) {
        console.error('Error in OpenAI API request:', error);
        return null;
    }
};

export const replaceCodeWithSmell = async (smellContent: string) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return;
    }

    await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, smellContent);
    });

    vscode.window.showInformationMessage('Code smell generated successfully.');
};

export const displayReplacedSmell = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return;
    }

    await editor.document.save();
    vscode.window.showTextDocument(editor.document);
};
