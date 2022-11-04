<script lang="ts">
	import DragDrop from '$lib/DragDrop.svelte';
	import type { TodoItem } from '$lib/interfaces';
	import { Progress, Container, Row, Col, Label, Input, FormGroup, Button } from 'sveltestrap/src';
	import { onDestroy, onMount } from 'svelte';

	let todos: TodoItem[] = [];
	const TIMER_INTERVAL_MS = 600;
	let progressBar = 0;
	let intervall1s: ReturnType<typeof setInterval>;
	let isInit = false;

	async function getDatabaseTodos(): Promise<TodoItem[]> {
		const response = await fetch('/api/todos')
			.then((res) => res.json())
			.then((res: { todos: TodoItem[] }) => res['todos'])
			.catch((error: Error) => {
				console.log(error);
				return [];
			});
		return response;
	}

	async function postDatabaseTodo(todo: TodoItem) {
		const postRequest = await fetch('/api/todos', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(todo)
		});
		const content = await postRequest.json();

		return content;
	}

	async function autoSyncCallback() {
		progressBar += 1;
		if (progressBar >= 100) {
			await syncTodoItems();
			progressBar = 0;
		}
	}

	async function syncTodoItems() {
		let retTodos: TodoItem[] = [];
		let isLocalStorageChange = false;
		let isDatabaseChange = false;

		const localStorageTodos = readTodoListFromLocalStorage();
		const databaseTodos = await getDatabaseTodos();

		//check if todoItem exists in localStorage AND in Database
		for (const localStorageTodo of localStorageTodos) {
			let index = databaseTodos.findIndex(
				(databaseTodo) => databaseTodo.createdDate == localStorageTodo.createdDate
			);

			//todoItem exits in localStorage and database
			if (index > -1) {
				//localStorage and database are sync
				if (localStorageTodo.modifiedDate == databaseTodos[index].modifiedDate) {
					retTodos.push(localStorageTodo);
				}
				//localStorage is outdatet => take databaseItem
				else if (localStorageTodo.modifiedDate < databaseTodos[index].modifiedDate) {
					retTodos.push(databaseTodos[index]);
					isLocalStorageChange = true;
				}

				//database is outdatet => take localStorageItem
				else if (localStorageTodo.modifiedDate > databaseTodos[index].modifiedDate) {
					retTodos.push(localStorageTodo);
					await postDatabaseTodo(localStorageTodo); //todo ret value
					isDatabaseChange = true;
				}
			}
			//todo Item only exists in local storage
			else {
				retTodos.push(localStorageTodo);
				await postDatabaseTodo(localStorageTodo); //todo ret value
				isDatabaseChange = true;
			}
		}

		//check for items, which are only in database
		for (const databaseTodo of databaseTodos) {
			let compareIndex = localStorageTodos.findIndex(
				(localStorageTodo) => localStorageTodo.createdDate == databaseTodo.createdDate
			);
			if (compareIndex == -1) {
				retTodos.push(databaseTodo);
				isLocalStorageChange = true;
			}
		}

		if (isLocalStorageChange == true) {
			writeTodoListToLocalStorage();
		}

		if (isDatabaseChange || isLocalStorageChange || !isInit) {
			isInit = true;
			todos = retTodos;
		}
	}

	onMount(async () => {
		await syncTodoItems();
		intervall1s = setInterval(autoSyncCallback, TIMER_INTERVAL_MS);
	});

	onDestroy(async () => {
		clearInterval(intervall1s);
	});

	function readTodoListFromLocalStorage(): TodoItem[] {
		let getTodos = localStorage.getItem('todoList');
		if (getTodos !== null) {
			return JSON.parse(getTodos);
		}
		return [];
	}

	async function writeTodoListToLocalStorage() {
		localStorage.setItem('todoList', JSON.stringify(todos));
	}

	function clearLocalStorage() {
		localStorage.clear();
		readTodoListFromLocalStorage();
	}

	async function addTodoItem(title: string) {
		if (title == '') {
			return;
		}
		const todoItem: TodoItem = {
			databaseId: 0,
			createdDate: Date.now(),
			title: title,
			description: '0',
			isDone: false,
			modifiedDate: Date.now()
		};
		todos[todos.length] = todoItem;
		addTodoTitle = '';
		await writeTodoListToLocalStorage();
		await postDatabaseTodo(todoItem); //todo ret value
		await syncTodoItems();
	}

	async function forceSync() {
		await syncTodoItems();
		progressBar = 0;
	}

	let addTodoTitle = '';
</script>

<Row>
	<Col>
		<Progress value={progressBar} style="height: 2px" />
	</Col>
</Row>

<Container>
	<Row>
		<Col sm="4">
			<Row>
				<Col><h3>Open</h3></Col>
			</Row>
			<Row>
				<Col>
					<DragDrop bind:data={todos} isOpenList={false} on:message={writeTodoListToLocalStorage} />
				</Col>
			</Row>
		</Col>
		<Col sm="4">
			<Row>
				<Col><h3>Done</h3></Col>
			</Row>
			<Row>
				<Col>
					<DragDrop bind:data={todos} isOpenList={true} on:message={writeTodoListToLocalStorage} />
				</Col>
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
						<Button color="danger" on:click={forceSync}>Force Sync</Button>
						<Button
							color="danger"
							on:click={() => {
								const todo = todos[0];
								todo.title = 'Hallo';
								todo.modifiedDate = Date.now();
								postDatabaseTodo(todos[0]);
							}}>Update Test</Button
						>
					</FormGroup>
				</Col>
			</Row>
		</Col>
	</Row>
</Container>
