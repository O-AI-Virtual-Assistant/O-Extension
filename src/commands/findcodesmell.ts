import * as vscode from 'vscode'; // Import VSCode API
import { OpenAI } from 'openai'; // Import OpenAI API

const apiKey = 'sk-proj-v7vk1qBAkYHA8fOtXhqvT3BlbkFJ8VBIdph3fJ7ya5kxDaXf'; // OpenAI API key

const openai = new OpenAI({ apiKey: apiKey }); // Create an OpenAI instance with the API key

export const makeCodeSmellCommand = async () => {
    // Main command function to generate code smell
    const selectedText = await getSelectedText(); // Get the selected text in the editor
    if (!selectedText) { // Check if no text is selected
        vscode.window.showInformationMessage('No code selected.'); // Show information message if no text is selected
        return; // Exit the function
    }

    let generatedSmell = await generateCodeSmell(selectedText); // Generate code smell from selected text
    if (!generatedSmell) { // Check if code smell generation failed
        generatedSmell = '// Failed to generate code smell.'; // Set failure message as generated smell
        vscode.window.showErrorMessage('Failed to generate code smell.'); // Show error message
    }

    await displayInSidePanel(generatedSmell); // Display the generated smell in a side panel
};

const getSelectedText = async () => {
    // Function to get the selected text in the editor
    const editor = vscode.window.activeTextEditor; // Get the active text editor
    if (!editor) { // Check if no active editor is found
        vscode.window.showErrorMessage('No active text editor found.'); // Show error message
        return null; // Return null
    }

    return editor.document.getText(editor.selection); // Return the selected text
};

export const generateCodeSmell = async (selectedCode: string) => {
    // Function to generate code smell using OpenAI
    const userMessage = `Introduce code smells into the following code:
    ${selectedCode}
    Code smells to introduce:
    - Long Method: Add unnecessary code to make the function longer.
    - Duplicate Code: Repeat the same logic unnecessarily.
    - Comments: Add redundant comments that explain obvious code.
    - Unnecessary Variables: Introduce unnecessary variables.
    - Complexity: Add unnecessary complexity.
    - Magic Numbers: Use hard-coded numbers with no explanation.`; // User message to instruct OpenAI on how to introduce code smells

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        }); // Call OpenAI API to generate the response

        const answer = response.choices.map((out) => out.message.content).join(' '); // Combine the response messages

        return answer; // Return the generated code smell
    } catch (error) {
        console.error('Error in OpenAI API request:', error); // Log error if API request fails
        return null; // Return null
    }
};

export const displayInSidePanel = async (content: string) => {
    // Function to display content in a side panel
    const panel = vscode.window.createWebviewPanel(
        'codeSmell', // Identifies the type of the webview. Used internally
        'Generated Code Smell', // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
        {} // Webview options. More on these later.
    ); // Create a new webview panel

    panel.webview.html = getWebviewContent(content); // Set the HTML content of the webview
};

const getWebviewContent = (content: string): string => {
    // Function to get the HTML content for the webview
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Generated Code Smell</title>
        </head>
        <body>
            <pre>${content}</pre> <!-- Display the content inside a <pre> tag -->
        </body>
        </html>
    `; // Return the HTML content as a string
};
