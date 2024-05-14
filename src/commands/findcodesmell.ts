// Import necessary modules
import * as vscode from 'vscode';
import { OpenAI } from 'openai';

// Initialize OpenAI instance with your API key
const openai = new OpenAI({ apiKey: 'api key' });
  
// Define the command function
export const findCodeSmellCommand = async () => {
    // Get the selected code
    const selectedCode = await getSelectedCode();
    if (!selectedCode) {
        vscode.window.showInformationMessage('No code selected.');
        return;
    }
  
    // Detect code smells
    const detectedSmells = await detectCodeSmells(selectedCode);
    if (detectedSmells.length === 0) {
      
         // Show message box with a webview
         showWebviewMessage('No code smells detected.');
         vscode.window.showInformationMessage('No code smells detected.');
        return;
    }

    // Display detected code smells
    vscode.window.showInformationMessage(`Detected code smells: ${detectedSmells.join(', ')}`);
};

// Function to get the selected code
const getSelectedCode = async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return null;
    }

    return editor.document.getText(editor.selection);
};

// Function to detect code smells
const detectCodeSmells = async (code: string) => {
  try {
      // Request code smell generation from OpenAI
      const response = await openai.completions.create({
          model: 'text-davinci-003', // Choose appropriate model
          prompt: `Generate code smells for the following code:\n${code}`,
          max_tokens: 100,
          temperature: 0.5,
          top_p: 1,
          n: 3 // Number of completions to generate
      });

      // Extract generated code smells from response
      const codeSmells = response.choices.map((choice: any) => choice.text.trim());

      return codeSmells;
  } catch (error) {
      console.error('Error in OpenAI API request:', error);
      return [];
  }
};


// Function to show message box with a webview
const showWebviewMessage = (message: string) => {
  const panel = vscode.window.createWebviewPanel(
      'codeSmellMessage', // Identifies the type of the webview. Used internally
      'Code Smell Detection', // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in
      {
          enableScripts: true // Enable JavaScript in the webview
      }
  );

  panel.webview.html = getWebviewContent(message);
};

// Function to get the HTML content for the webview
const getWebviewContent = (message: string) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code Smell Detection</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: rgba(0, 0, 0, 0);
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  padding: 10px;
                  border: 2px solid black;
                  border-radius: 10px;
                  z-index: 9999;
                  max-width: 300px;
                  text-align: center;
                  font-size: 14px;
                  color: white;
              }
          </style>
      </head>
      <body>
          <h1>${message}</h1>
      </body>
      </html>
  `;
};