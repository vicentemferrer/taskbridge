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

export const createTaskSchema = z.object({
	title: z.string().trim().min(1, { error: 'Name required' }),
	description: z.string().max(2000, { error: '2000 characters maximum' }),
	list: z.string(),
	dueDate: z.string()
});
