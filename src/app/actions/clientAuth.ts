import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { auth } from '../lib/firebase';
import { createSession } from './adminAuth';

import { loginSchema, signupSchema } from '@/app/lib/schemas';

type FormState = {
	success: boolean;
	errors?: {
		email?: string;
		nick?: string;
		password?: string;
		confirmPassword?: string;
		general?: string;
	};
	message?: string;
};

export async function loginUser(prevState: FormState, formData: FormData): Promise<FormState> {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const rememberMe = formData.get('rememberMe');

	const result = loginSchema.safeParse({ email, password, rememberMe });

	if (!result.success) {
		const errors: FormState['errors'] = {};
		result.error.issues.forEach((err) => {
			if (err.path[0] === 'email') errors.email = err.message;
			if (err.path[0] === 'password') errors.password = err.message;
		});
		return { success: false, errors };
	}

	try {
		const userCredentials = await signInWithEmailAndPassword(auth, email, password);
		const token = await userCredentials.user.getIdToken();

		await createSession({ token, path: '/login' });
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			console.error(`login failed: ${err.message}`);
			return { success: false, message: `Error on log in` };
		}
	}

	return { success: true, message: 'Welcome!' };
}

export async function signupUser(prevState: FormState, formData: FormData): Promise<FormState> {
	const email = formData.get('email') as string;
	const nick = formData.get('nick') as string;
	const password = formData.get('password') as string;
	const confirmPassword = formData.get('confirmPassword') as string;

	const result = signupSchema.safeParse({ email, nick, password, confirmPassword });

	if (!result.success) {
		const errors: FormState['errors'] = {};
		result.error.issues.forEach((err) => {
			if (err.path[0] === 'email') errors.email = err.message;
			if (err.path[0] === 'nick') errors.nick = err.message;
			if (err.path[0] === 'password') errors.password = err.message;
			if (err.path[0] === 'confirmPassword') errors.confirmPassword = err.message;
		});

		return { success: false, errors };
	}

	try {
		const userCredentials = await createUserWithEmailAndPassword(auth, email, password).then(
			async (credentials) =>
				await updateProfile(credentials.user, { displayName: nick })
					.then(() => credentials)
					.catch((err) => {
						throw err.message;
					})
		);

		const token = await userCredentials.user.getIdToken();

		await createSession({ token, path: '/signup' });
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			console.error(`signup failed: ${err.message}`);
			return { success: false, message: 'Error on sign up' };
		}
	}

	return { success: true, message: 'Welcome!' };
}
