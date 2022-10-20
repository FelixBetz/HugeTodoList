<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from 'sveltestrap/src';

	let cnt = 0;

	onMount(async () => {
		localStorage.setItem('myCat', cnt.toString());
	});
</script>

<p>cnt: {cnt}</p>
<Button on:click={() => console.log(localStorage.getItem('myCat'))}>Read localStorage</Button>
<Button
	on:click={() => {
		cnt++;
		localStorage.setItem('myCat', cnt.toString());
	}}
>
	write localStorage
</Button>
