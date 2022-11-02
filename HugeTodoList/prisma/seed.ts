import PrismaClientPkg from '@prisma/client';

// Prisma doesn't support ES Modules so we have to do this
const PrismaClient = PrismaClientPkg.PrismaClient;
const prisma = new PrismaClient();

function getTodoItems() {
	return [
		{
			createdId: 0,
			title: 'Test1',
			description: `SvelteKit is lit. 🔥`,
			isDone: false,
			modifiedDate: 0
		}
	];
}

async function seed() {
	const todos = getTodoItems();

	for (const todo of todos) {
		await prisma.todoItem.create({ data: todo });
	}
}

seed();
