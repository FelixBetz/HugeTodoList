<script lang="ts">
	import DragDrop from '$lib/DragDrop.svelte';
	import type { TodoItem } from '$lib/interfaces';
	import { Container, Row, Col } from 'sveltestrap/src';

	let todos: TodoItem[] = [
		{ id: 0, title: 'Test0', description: '0', isDone: false, categoryId: 0 },
		{ id: 1, title: 'Test1', description: '1', isDone: true, categoryId: 0 },
		{ id: 2, title: 'Test2', description: '2', isDone: false, categoryId: 1 },
		{ id: 3, title: 'Test3', description: '3', isDone: true, categoryId: 1 }
	];
</script>

<Container>
	<Row>
		<Col sm="3">
			<DragDrop bind:data={todos} />
		</Col>
	</Row>
</Container>
