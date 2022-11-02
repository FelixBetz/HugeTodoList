import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import prisma from '$lib/prisma';
import type { Todo } from '@prisma/client';
import type { TodoItem } from '$lib/interfaces';

export const GET: RequestHandler = async () => {
	const databaseTodos: Todo[] = await prisma.todo.findMany({
		//orderBy: { posted: 'desc' }
	});
	const todos: TodoItem[] = [];
	for (const todo of databaseTodos) {
		todos.push({
			databaseId: todo.databaseId,
			createdDate: Number(todo.createdDate),
			title: todo.title,
			description: todo.description,
			isDone: todo.isDone,
			modifiedDate: Number(todo.modifiedDate)
		});
	}
	return json({
		todos
	});
};

//create new element in database
export const POST: RequestHandler = async ({ request }) => {
	const todo: TodoItem = await request.json();

	const getTodoItem = await prisma.todo.findUnique({
		where: { createdDate: todo.createdDate }
	});

	//todo Item does not exist => create new one
	if (getTodoItem == null) {
		await prisma.todo.create({
			data: {
				createdDate: BigInt(todo.createdDate),
				title: todo.title,
				description: todo.description,
				isDone: todo.isDone,
				modifiedDate: BigInt(Date.now())
			}
		});
	}
	//update todo Item
	else {
		await prisma.todo.update({
			where: { createdDate: todo.createdDate },
			data: {
				createdDate: BigInt(todo.createdDate),
				title: todo.title,
				description: todo.description,
				isDone: todo.isDone,
				modifiedDate: BigInt(todo.modifiedDate)
			}
		});
	}

	const retString = 'ok';
	return json(retString);
};
