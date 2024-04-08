<script lang="ts">
  import { onMount } from "svelte";
  let chat = "";
  let query = "";
  let test = "";
  let accessToken = "";
  let loading = true;
  let user: { name: string; id: number } | null = null;

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      switch (event.data.type) {
        case "AskO":
          query = event.data.value;
          break;
        case "token":
          accessToken = event.data.value;
          const response = await fetch(`${apiBaseUrl}/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          user = data.user;
          loading = false;
          break;
      }
    });

    tsvscode.postMessage({ type: "get-token", value: undefined });
  });

  async function makeUnitTest(q: string) {
    try {
      const response = await fetch(`http://localhost:3002/unit-test`, {
        method: "POST",
        body: JSON.stringify({
          text: q,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { answer } = await response.json();

      // Replace semicolons with semicolon + newline
      test = answer.replace(/;/g, ";\n");

      chat += answer;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  }
</script>

{#if loading}
  <p>Loading...</p>
{:else if user}
  <pre> {JSON.stringify(user, null, 2)} </pre>
{:else}
  <p>Not logged in</p>
{/if}

<input type="text" placeholder="What's on your mind?" bind:value={query} />

<!-- svelte-ignore missing-declaration -->
<button
  on:click={() => {
    tsvscode.postMessage({ type: "onInfo", value: "O is Working" });
    makeUnitTest(query);
    chat += query;
    chat += "\n";
    query = "";
  }}>Go</button
>

<h1><code>{test}</code></h1>

<style>
  h1 {
    font: 18px ubuntu;
    font-weight: 300;
  }
  code {
    font-family: "Courier New", Courier, monospace;
    background-color: #000000;
    padding: 2px 4px;
    border-radius: 4px;
  }
</style>
