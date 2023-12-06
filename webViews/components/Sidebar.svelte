<script lang='ts'>
  import { onMount } from "svelte";
  let chat = "";
  let query = "";
  let response = "";

    onMount(() => {
        window.addEventListener('message', event => {
            switch (event.data.type) {
                case 'AskO':
                    query = event.data.value;
                    break;
            }
        });
    });

</script>

<style>
p{
    font: 20px ubuntu;
}
</style>

<input type="text" placeholder="What's on your mind?" bind:value={query} />


<!-- svelte-ignore missing-declaration -->
<button on:click={() =>{
    tsvscode.postMessage({ type: 'onInfo' , value: "O is Working"});
    chat += query;
    chat += "\n";
    query = "";
}}>Go</button>

<p>{chat}</p>
