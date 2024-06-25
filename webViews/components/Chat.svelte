<script lang="ts">
  import { onMount } from 'svelte';
  let message = '';
  let messages = [];

  // This function will be invoked when the user clicks the "Send" button
  function sendMessage() {

  }

  // Setup to receive messages from VS Code extension
  onMount(() => {

    window.addEventListener('message', event => {
      const { command, text } = event.data;
      if (command === 'receiveMessage') {
        messages = [...messages, text];
      }
    });
  });
</script>

<main>
  <h1>Chat with O</h1>
  <div class="chatbox">
    {#each messages as msg}
      <p>{msg}</p>
    {/each}
  </div>
  <input type="text" bind:value={message} on:keyup="{event => event.key === 'Enter' && sendMessage()}" placeholder="Type a message...">
  <button on:click="{sendMessage}">Send</button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .chatbox {
    width: 100%;
    border: 1px solid #ccc;
    min-height: 200px;
    margin-bottom: 10px;
    padding: 10px;
    overflow-y: auto;
  }

  input[type="text"] {
    width: 80%;
    padding: 8px;
    margin-right: 10px;
  }

  button {
    padding: 10px 20px;
  }
</style>
