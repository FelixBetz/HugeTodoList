export interface TodoItem {
	id: number;
	title: string;
	description: string;

	/*reminderDate: todo;
    repeat: todo; */
	isDone: boolean;
	categoryId: number;
	modifiedDate: number;
}
