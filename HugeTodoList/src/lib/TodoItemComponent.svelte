<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Icon, Modal, ModalHeader, ModalFooter, ModalBody, Button, Input } from 'sveltestrap/src';
	import type { TodoItem } from '$lib/interfaces';

	export let item: TodoItem | null = null;

	let isModalOpen = false;

	const dispatch = createEventDispatcher();

	function cancelChanges() {
		isModalOpen = false;
	}

	function saveChanges() {
		isModalOpen = false;
		if (item != null) {
			item.modifiedDate = Date.now();
			dispatch('save', {
				text: 'save'
			});
		}
	}

	function dispatchOnCheckChange() {
		if (item != null) {
			item.isDone = !item?.isDone;
			item.modifiedDate = Date.now();
		}

		dispatch('save', {
			text: 'save'
		});
	}
</script>

{#if item != null}
	<div>
		<Icon name={item.isDone ? 'check-circle' : 'circle'} onclick={dispatchOnCheckChange} />
		<span class:isDone={item.isDone}>
			{item.title}
		</span>
		<Icon name="pencil-fill" onclick={() => (isModalOpen = true)} />

		<Modal isOpen={isModalOpen} size="xl">
			<ModalHeader>{item.title}</ModalHeader>
			<ModalBody>
				{item.databaseId}
				{item.createdDate}
				{item.modifiedDate}
				<Input type="checkbox" bind:value={item.isDone} />
				<Input type="text" bind:value={item.title} />
				<Input type="textarea" bind:value={item.description} />
			</ModalBody>
			<ModalFooter>
				<Button color="primary" on:click={saveChanges}>Save</Button>
				<Button color="secondary" on:click={cancelChanges}>Cancel</Button>
			</ModalFooter>
		</Modal>
	</div>
{/if}

<style>
	div {
		border: 1px black solid;
	}
	.isDone {
		text-decoration: line-through;
	}
</style>
