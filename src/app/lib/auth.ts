'use server';

import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from './firebase';
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

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	const result = loginSchema.safeParse({ email, password });

	if (!result.success) {
		const errors: FormState['errors'] = {};
		result.error.issues.forEach((err) => {
			if (err.path[0] === 'email') errors.email = err.message;
			if (err.path[0] === 'password') errors.password = err.message;
		});
		return { success: false, errors };
	}

	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			return { success: false, message: 'Error on log in' };
		}
	}

	revalidatePath('/login');

	return { success: true, message: 'Login successful!' };
}

export async function signupAction(prevState: FormState, formData: FormData): Promise<FormState> {
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
		await createUserWithEmailAndPassword(auth, email, password).then(async (credentials) => {
			await updateProfile(credentials.user, { displayName: nick }).catch((error) => {
				throw error.message;
			});
		});
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			return { success: false, message: 'Error on sign up' };
		}
	}

	revalidatePath('/signup');

	return { success: true, message: 'Sign Up successful!' };
}

export async function logoutAction(formData: FormData) {
	try {
		await signOut(auth);
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			console.error({ success: false, message: 'Error on sign out' });
		}
	}

	revalidatePath('/');
	redirect('/');

	console.info({ success: true, message: 'Sign out successful!' });
}
