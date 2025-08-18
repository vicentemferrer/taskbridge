'use server';

import { FirebaseError } from 'firebase/app';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';

import { auth } from '@/app/lib/firebaseAdmin';

export async function createSession({ token, path }: { token: string; path: string }) {
	const cookieStore = await cookies();

	try {
		await auth.verifyIdToken(token);
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			console.error('createSession failed: Error on verification');
			throw new Error(err.message);
		}
	}

	try {
		const expiresIn = 1000 * 60 * 60 * 24 * 5;
		const sessionCookie = await auth.createSessionCookie(token, { expiresIn });

		cookieStore.set('session', sessionCookie, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: expiresIn / 1000
		});
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			console.error('createSession failed: Error on cookie');
			throw new Error(err.message);
		}
	}

	revalidatePath(path);
	redirect('/');
}

export async function collapseSession() {
	const headersList = await headers();
	const cookieStore = await cookies();

	try {
		cookieStore.delete('session');
	} catch (err) {
		if (err instanceof Error) {
			console.error('collappseSession failed');
			throw new Error(err.message);
		}
	}

	const referer = headersList.get('referer');

	if (referer) {
		const url = new URL(referer);
		const pathname = url.pathname;

		revalidatePath(pathname);
		redirect('/');
	}
}

export async function getUserFromSession() {
	const cookieStore = await cookies();
	const session = cookieStore.get('session')?.value;

	if (!session) return null;

	try {
		const decodedClaims = await auth.verifySessionCookie(session, true);
		return decodedClaims;
	} catch {
		return null;
	}
}
