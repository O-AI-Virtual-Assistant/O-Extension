<script lang='ts'>
  import { onMount } from "svelte";
  let text = "";

    onMount(() => {
        window.addEventListener('message', event => {
            switch (event.data.type) {
                case 'AskO':
                    text = event.data.value;
                    break;
            }
        });
    });

</script>

<style>
    
</style>

<input type="text" placeholder="What's on your mind?">
<button>Go</button>

<p>{text}</p>

<!-- svelte-ignore missing-declaration -->
<button on:click={() =>{
            tsvscode.postMessage({ type: 'onInfo' , value: "land of the free"});
        }}>click</button>