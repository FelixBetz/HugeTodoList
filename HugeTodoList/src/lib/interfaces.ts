export interface TodoItem {
	createdId: number;
	title: string;
	description: string;

	/*reminderDate: todo;
    repeat: todo; */
	isDone: boolean;
	categoryId: number;
	modifiedDate: number;
}
