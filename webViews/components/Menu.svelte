<script>
    export let onExplainCode;
    export let onMakeDocumentation;
    export let onNewChat;
    export let onEditCode;
    export let onGenerateUnitTests;
    import { findCodeSmellCommand } from ".../src/commands/findcodesmell";
    export let onCustomCommands;
  
    function handleExplainCode() {
      if (onExplainCode) {
        onExplainCode();
      }
    }
  
    function handleMakeDocumentation() {
      if (onMakeDocumentation) {
        onMakeDocumentation();
      }
    }
  
    function handleNewChat() {
      if (onNewChat) {
        onNewChat();
      }
    }
  
    function handleEditCode() {
      if (onEditCode) {
        onEditCode();
      }
    }
  
    function handleGenerateUnitTests() {
      if (onGenerateUnitTests) {
        onGenerateUnitTests();
      }
    }
  
    function handleFindCodeSmells() {
    // Call the findCodeSmellCommand function directly
    findCodeSmellCommand();
}

  
    function handleCustomCommands() {
      if (onCustomCommands) {
        onCustomCommands();
      }
    }
  </script>
  
  <div class="options">
    <div class="option" on:click={handleExplainCode}>
      <span class="icon">📝</span>
      <span>Explain Code</span>
    </div>
    <div class="option" on:click={handleMakeDocumentation}>
      <span class="icon">📄</span>
      <span>Make Documentation</span>
    </div>
    <div class="option" on:click={handleNewChat}>
      <span class="icon">💬</span>
      <span>New Chat</span>
    </div>
    <div class="option" on:click={handleEditCode}>
      <span class="icon">✏️</span>
      <span>Edit Code</span>
    </div>
    <div class="option" on:click={handleGenerateUnitTests}>
      <span class="icon">🧪</span>
      <span>Generate Unit Tests</span>
    </div>
    <div class="option" on:click={handleFindCodeSmells}>
      <span class="icon">👃</span>
      <span>Find Code Smells</span>
    </div>
    <div class="option" on:click={handleCustomCommands}>
      <span class="icon">🔧</span>
      <span>Custom Commands</span>
    </div>
  </div>
  
  <style>
    .options {
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
    }
  
    .option {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      margin: 10px;
    }
  
    .icon {
      font-size: 24px;
      margin-bottom: 5px;
    }
  </style>
  