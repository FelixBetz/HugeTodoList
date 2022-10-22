import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { TodoItem } from '$lib/interfaces';

export const GET: RequestHandler = () => {
	const todos: TodoItem[] = [
		{ id: 0, title: 'Test0', description: '0', isDone: false, categoryId: 0, modifiedDate: 0 },
		{ id: 1, title: 'Test1', description: '1', isDone: true, categoryId: 0, modifiedDate: 0 },
		{ id: 2, title: 'Test2', description: '2', isDone: false, categoryId: 1, modifiedDate: 0 },
		{ id: 3, title: 'Test3', description: '3', isDone: true, categoryId: 1, modifiedDate: 0 }
	];
	return json({
		todos
	});
};
