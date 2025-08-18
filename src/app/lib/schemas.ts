import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email({ error: 'Invalid email address' }).trim(),
	password: z.string().min(8, { error: 'Password must be at least 8 characters long' }),
	rememberMe: z.preprocess((val) => val === 'on', z.boolean().optional())
});

export const signupSchema = z
	.object({
		email: z.email({ error: 'Invalid email address' }),
		nick: z
			.string()
			.min(3, { error: 'Must be 3 characters long at least' })
			.max(20, { error: 'No bigger than 20 characters' })
			.regex(/^[a-zA-Z0-9_]+$/, {
				error: 'Only letters, numbers, and underscores'
			}),
		password: z.string().min(8, { error: 'Password must be at least 8 characters long' }),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const createTaskSchema = z
	.object({
		title: z.string().trim().min(1, { error: 'El título es obligatorio' }),
		description: z
			.string()
			.max(2000, { error: 'Máximo 2000 caracteres' })
			.optional()
			.or(z.literal(''))
			.transform((v) => (v === '' ? undefined : v)),
		status: z.enum(['pending', 'in_progress', 'done'], {
			error: 'El estado es obligatorio'
		}),
		list: z
			.string()
			.optional()
			.or(z.literal(''))
			.transform((v) => (v === '' ? undefined : v)),
		ownerId: z.string().trim().min(1, { error: 'El ownerId es obligatorio' }),
		sharedWith: z
			.string()
			.optional()
			.or(z.literal(''))
			.transform((s) =>
				s
					? s
							.split(',')
							.map((x) => x.trim())
							.filter(Boolean)
					: []
			),
		dueDate: z
			.string()
			.optional()
			.or(z.literal(''))
			.transform((v) => (v === '' ? undefined : v)),
		priority: z
			.string()
			.optional()
			.or(z.literal(''))
			.transform((v) => (v === '' ? undefined : Number(v)))
			.refine((v) => v === undefined || (Number.isFinite(v) && v >= 1 && v <= 5), {
				error: 'La prioridad debe ser un número entre 1 y 5'
			}),
		completedAt: z
			.string()
			.optional()
			.or(z.literal(''))
			.transform((v) => (v === '' ? undefined : v))
	})
	.refine((data) => !data.completedAt || data.status === 'done', {
		error: "Solo puedes establecer fecha de finalización si el estado es 'done'",
		path: ['completedAt']
	});
