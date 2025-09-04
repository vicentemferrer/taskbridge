'use server';

import { Timestamp } from 'firebase/firestore';

import { createTaskSchema } from '@/app/lib/schemas';
import type { Task } from '@/app/lib/types';
import { createTask, updateTask } from '../lib/query';

import { getUserFromSession } from './adminAuth';
import { revalidatePath } from 'next/cache';

type CreateTaskFormState = {
	success: boolean;
	errors?: Partial<Record<keyof CreateTaskFormFields, string>>;
	message?: string;
	task?: Omit<Task, 'id'>;
};

type UpdateStatusState = {
	success: boolean;
	error?: string;
	newStatus?: Task['status'];
};

type CreateTaskFormFields = {
	title: string;
	description: string;
	list: string;
	dueDate: string;
};

function toTimestamp(date: Date): Timestamp {
	return Timestamp.fromDate(date);
}

function parseDateInput(s: string): Date {
	return new Date(`${s}T00:00:00`);
}

export async function createTaskAction(
	_prev: CreateTaskFormState,
	formData: FormData
): Promise<CreateTaskFormState> {
	const raw = {
		title: formData.get('title') as string,
		description: formData.get('description') as string,
		list: formData.get('list') as string,
		dueDate: formData.get('dueDate') as string
	};

	const parsed = createTaskSchema.safeParse(raw);

	if (!parsed.success) {
		const errors: CreateTaskFormState['errors'] = {};
		for (const err of parsed.error.issues) {
			const field = err.path[0] as keyof CreateTaskFormFields;
			if (field) errors[field] = err.message;
		}

		return { success: false, errors };
	}

	const data = parsed.data as CreateTaskFormFields;

	const now = new Date();
	const due = parseDateInput(data.dueDate);

	const user = await getUserFromSession();

	const task: Omit<Task, 'id'> = {
		title: data.title,
		description: data.description,
		status: 'pending',
		list: data.list,
		ownerId: !!user ? user.uid : '',
		sharedWith: [],
		createdAt: toTimestamp(now),
		updatedAt: toTimestamp(now),
		dueDate: toTimestamp(due)
	};

	await createTask(task);

	return {
		success: true,
		message: 'Tarea creada correctamente.'
	};
}

function getNextStatus(currentStatus: Task['status']): Task['status'] {
	switch (currentStatus) {
		case 'pending':
			return 'in_progress';
		case 'in_progress':
			return 'done';
		case 'done':
			return 'pending';
		default:
			return 'pending';
	}
}

export async function updateTaskStatusAction(
	taskId: string,
	currentStatus: Task['status']
): Promise<UpdateStatusState> {
	try {
		const newStatus = getNextStatus(currentStatus);

		await updateTask(taskId, { status: newStatus });

		revalidatePath(`/tasks/${taskId}`);
		revalidatePath('/');

		return {
			success: true,
			newStatus
		};
	} catch (err) {
		console.error('Error actualizando status de tarea:', err);
		return {
			success: false,
			error: err
		};
	}
}
