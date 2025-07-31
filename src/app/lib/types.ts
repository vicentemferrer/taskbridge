import type { Timestamp } from 'firebase/firestore';

export interface Task {
	id: string;
	title: string;
	description?: string;
	status: 'pending' | 'in_progress' | 'done';
	list?: string;
	ownerId: string;
	sharedWith?: string[];
	createdAt: Timestamp | TimestampMock;
	updatedAt: Timestamp | TimestampMock;
	dueDate?: Timestamp | TimestampMock;
	priority?: number;
	completedAt?: Timestamp | TimestampMock;
}

export type TimestampMock = {
	toDate: () => Date;
};
