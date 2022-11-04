<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Icon } from 'sveltestrap/src';
	import type { TodoItem } from '$lib/interfaces';

	export let item: TodoItem | null = null;

	const dispatch = createEventDispatcher();

	function dispatchOnCheckChange() {
		if (item != null) {
			item.isDone = !item?.isDone;
		}

		dispatch('checkChange', {
			text: 'checkChange'
		});
	}
</script>

{#if item != null}
	{#if !item.isDone}
		<div class="todoOpen">
			<Icon name="circle" onclick={dispatchOnCheckChange} />
			{item.title}
		</div>
	{:else}
		<div class="todoDone">
			<Icon name="check-circle" onclick={dispatchOnCheckChange} />
			{item.title}
		</div>
	{/if}
{/if}

<style>
	.todoOpen {
		border: 1px black solid;
	}
	.todoDone {
		text-decoration: line-through;
		border: 1px black solid;
	}
</style>
