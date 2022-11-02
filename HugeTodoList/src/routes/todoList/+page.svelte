<script lang="ts">
	import DragDrop from '$lib/DragDrop.svelte';
	import type { TodoItem } from '$lib/interfaces';
	import { Container, Row, Col, Label, Input, FormGroup, Button } from 'sveltestrap/src';
	import { onMount } from 'svelte';
	let todos: TodoItem[] = [];

	async function getServerTodos(): Promise<TodoItem[]> {
		const response = await fetch('/api/todos')
			.then((res) => res.json())
			.then((res: { todos: TodoItem[] }) => res['todos'])
			.catch((error: Error) => {
				console.log(error);
				return [];
			});
		return response;
	}

	async function syncTodoItems() {
		todos = readTodoListFromLocalStorage();

		await getServerTodos().then((res: TodoItem[]) => {
			for (let i = 0; i < res.length; i++) {
				let index = todos.findIndex((todo) => todo.createdId == res[i].createdId);

				//check if item exists in localStorage and on server
				if (index > -1) {
					//take item with latest modified date
					if (todos[index].modifiedDate < res[i].modifiedDate) {
						todos[i] = res[i];
					}
				} else {
					//add server item to todoList
					todos[todos.length] = res[i];
				}
			}
		});
	}

	onMount(async () => {
		await syncTodoItems();
	});

	function readTodoListFromLocalStorage(): TodoItem[] {
		let getTodos = localStorage.getItem('todoList');
		if (getTodos !== null) {
			return JSON.parse(getTodos);
		}
		return [];
	}

	function writeTodoListToLocalStorage() {
		localStorage.setItem('todoList', JSON.stringify(todos));
	}

	function clearLocalStorage() {
		localStorage.clear();
		readTodoListFromLocalStorage();
	}

	function addTodoItem(title: string) {
		if (title == '') {
			return;
		}
		todos[todos.length] = {
			databaeId: 0,
			createdId: Date.now(),
			title: title,
			description: '0',
			isDone: false,
			modifiedDate: Date.now()
		};
		addTodoTitle = '';
		writeTodoListToLocalStorage();
	}

	let addTodoTitle = '';
</script>

<form action="/api/items" method="GET">
	<button>Get Items</button>
</form>

<Container>
	<Row>
		<Col sm="4">
			<Row>
				<Col><h3>Open</h3></Col>
			</Row>
			<Row>
				<Col><DragDrop bind:data={todos} isOpenList={false} /></Col>
			</Row>
		</Col>
		<Col sm="4">
			<Row>
				<Col><h3>Done</h3></Col>
			</Row>
			<Row>
				<Col><DragDrop bind:data={todos} isOpenList={true} /></Col>
			</Row>
		</Col>

		<Col sm="4">
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
						<Button color="danger" on:click={clearLocalStorage}>Clear Local Storage</Button>
						<Button color="danger" on:click={syncTodoItems}>sync</Button>
					</FormGroup>
				</Col>
			</Row>
		</Col>
	</Row>
</Container>
