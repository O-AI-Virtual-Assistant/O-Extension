<script lang="ts">
  import { onMount } from "svelte";
  import UnitTest from "./UnitTest.svelte";
  import type { User } from "../types";
  import Menu from "./Menu.svelte";

  export let onExplainCode;
  export let onMakeDocumentation;
  export let onNewChat;
  export let onEditCode;
  export let onGenerateUnitTests;
  export let onFindCodeSmells;
  export let onCustomCommands;

  let accessToken = "";
  let loading = true;
  let user: User | null = null;

  onMount(async () => {
    window.addEventListener("message", async (event) => {
      switch (event.data.type) {
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
</script>

{#if loading}
  <p>Loading...</p>
{:else if user}
  <h1>Hello {user.name}</h1>
  <!-- svelte-ignore missing-declaration -->
  <button
    on:click={() => {
      accessToken = "";
      user = null;
      tsvscode.postMessage({ type: "logout", value: undefined });
    }}>Logout</button
  >
{:else}
  <!-- svelte-ignore missing-declaration -->
  <button
    on:click={() => {
      tsvscode.postMessage({ type: "authenticate", value: undefined });
    }}>Log In</button
  >
{/if}

<Menu
  {onExplainCode}
  {onMakeDocumentation}
  {onNewChat}
  {onEditCode}
  {onGenerateUnitTests}
  {onFindCodeSmells}
  {onCustomCommands}
/>
