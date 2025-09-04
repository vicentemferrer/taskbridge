import type { Timestamp } from 'firebase/firestore';

export interface Task {
	id: string;
	title: string;
	description: string;
	status: 'pending' | 'in_progress' | 'done';
	list: string;
	ownerId: string;
	sharedWith: string[];
	createdAt: Timestamp;
	updatedAt: Timestamp;
	dueDate?: Timestamp;
	completedAt?: Timestamp;
}

type ConvertTimestampToDate<T> = {
	[K in keyof T]: T[K] extends Timestamp
		? Date
		: T[K] extends Timestamp | undefined
		? Date | undefined
		: T[K];
};

export type PlainTask = ConvertTimestampToDate<Task>;

export function flattenTask(task: Task): PlainTask {
	return {
		id: task.id,
		title: task.title,
		description: task.description,
		status: task.status,
		list: task.list,
		ownerId: task.ownerId,
		sharedWith: [...task.sharedWith], // Crear una copia del array
		createdAt: task.createdAt.toDate(),
		updatedAt: task.updatedAt.toDate(),
		dueDate: task.dueDate?.toDate(),
		completedAt: task.completedAt?.toDate()
	};
}
