<script lang="ts">
	import { each } from 'svelte/internal';

	interface TodoItem {
		id: number;
		title: string;
		description: string;

		/*reminderDate: todo;
        repeat: todo; */
		isDone: boolean;
		categoryId: number;
	}

	let todos: TodoItem[] = [
		{ id: 0, title: 'Test0', description: '0', isDone: false, categoryId: 0 },
		{ id: 1, title: 'Test1', description: '1', isDone: false, categoryId: 0 },
		{ id: 2, title: 'Test2', description: '2', isDone: false, categoryId: 1 },
		{ id: 3, title: 'Test3', description: '3', isDone: false, categoryId: 1 }
	];
</script>

<ul>
	{#each todos as todo}
		<li>{todo.title}</li>
	{/each}
</ul>
