<script lang="ts">
	import DragDrop from '$lib/DragDrop.svelte';
	import type { TodoItem } from '$lib/interfaces';
	import { Container, Row, Col, Label, Input, FormGroup, Button } from 'sveltestrap/src';

	let todos: TodoItem[] = [
		{ id: 0, title: 'Test0', description: '0', isDone: false, categoryId: 0 },
		{ id: 1, title: 'Test1', description: '1', isDone: true, categoryId: 0 },
		{ id: 2, title: 'Test2', description: '2', isDone: false, categoryId: 1 },
		{ id: 3, title: 'Test3', description: '3', isDone: true, categoryId: 1 }
	];

	function addTodoItem(title: string) {
		console.log();
		if (title == '') {
			return;
		}
		todos[todos.length] = {
			id: Date.now(),
			title: title,
			description: '0',
			isDone: false,
			categoryId: 0
		};
		addTodoTitle = '';
	}

	let addTodoTitle = '';
</script>

<Container>
	<Row>
		<Col sm="3">
			<Row>
				<Col><h3>Open</h3></Col>
			</Row>
			<Row>
				<Col><DragDrop bind:data={todos} isOpenList={false} /></Col>
			</Row>
		</Col>
		<Col sm="3">
			<Row>
				<Col><h3>Done</h3></Col>
			</Row>
			<Row>
				<Col><DragDrop bind:data={todos} isOpenList={true} /></Col>
			</Row>
		</Col>
		<Col sm="3" />
		<Col sm="3">
			<Row>
				<Col><h3>Add</h3></Col>
			</Row>
			<Row>
				<Col>
					<FormGroup>
						<Label for="title">Title</Label>
						<Input
							type="text"
							name="title"
							id="title"
							placeholder="title"
							bind:value={addTodoTitle}
						/>
					</FormGroup>
					<FormGroup>
						<Button color="primary" on:click={() => addTodoItem(addTodoTitle)}>Add Todo</Button>
					</FormGroup>
				</Col>
			</Row>
		</Col>
	</Row>
</Container>
