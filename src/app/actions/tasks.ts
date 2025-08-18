'use server';

import type { Timestamp } from 'firebase/firestore';

import { createTaskSchema } from '@/app/lib/schemas';
import type { Task } from '@/app/lib/types';

type CreateTaskFormState = {
	success: boolean;
	errors?: Partial<Record<keyof CreateTaskFormFields, string>>;
	message?: string;
	task?: Task;
};

type CreateTaskFormFields = {
	title: string;
	description?: string;
	status: 'pending' | 'in_progress' | 'done';
	list?: string;
	ownerId: string;
	sharedWith: string[];
	dueDate?: string;
	priority?: number;
	completedAt?: string;
};

function toTimestamp(date: Date): Timestamp {
	return { toDate: () => date } as unknown as Timestamp;
}

function parseDateInput(s?: string): Date | undefined {
	if (!s) return undefined;
	return new Date(`${s}T00:00:00`);
}

export async function createTaskAction(
	_prev: CreateTaskFormState,
	formData: FormData
): Promise<CreateTaskFormState> {
	const raw = {
		title: (formData.get('title') as string) ?? '',
		description: (formData.get('description') as string) ?? '',
		status: ((formData.get('status') as string) ?? 'pending') as CreateTaskFormFields['status'],
		list: (formData.get('list') as string) ?? '',
		ownerId: (formData.get('ownerId') as string) ?? '',
		sharedWith: (formData.get('sharedWith') as string) ?? '',
		dueDate: (formData.get('dueDate') as string) ?? '',
		priority: (formData.get('priority') as string) ?? '',
		completedAt: (formData.get('completedAt') as string) ?? ''
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

	const data = parsed.data as unknown as CreateTaskFormFields;

	const now = new Date();
	const due = parseDateInput(data.dueDate);
	const completed = parseDateInput(data.completedAt);

	// En una implementación real, aquí escribirías en Firestore y usarías el doc.id generado.

	const task: Task = {
		id: `temp_${Math.random().toString(36).slice(2)}`,
		title: data.title,
		description: data.description,
		status: data.status,
		list: data.list,
		ownerId: data.ownerId,
		sharedWith: data.sharedWith ?? [],
		createdAt: toTimestamp(now),
		updatedAt: toTimestamp(now),
		dueDate: due ? toTimestamp(due) : undefined,
		priority: data.priority,
		completedAt: completed ? toTimestamp(completed) : undefined
	};

	// Simulación de persistencia (log). Sustituir por Firestore en el futuro.
	console.log('Nueva tarea creada (simulada):', task);

	return {
		success: true,
		message: 'Tarea creada correctamente.',
		task
	};
}
