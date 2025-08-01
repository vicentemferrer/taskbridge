import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email({ error: 'Invalid email address' }).trim(),
	password: z.string().min(8, { error: 'Password must be at least 8 characters long' })
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
