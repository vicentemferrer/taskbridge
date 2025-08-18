import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { auth } from '../lib/firebase';
import { collapseSession, getUserFromSession } from '../actions/adminAuth';

import styles from './Header.module.css';

export default async function Header() {
	const user = await getUserFromSession();

	async function logoutUser(formData: FormData) {
		'use server';

		try {
			await signOut(auth);
			await collapseSession();
		} catch (err) {
			if (err instanceof Error || err instanceof FirebaseError) {
				console.error(`signup failed: ${err.message}`);
			}
		}

		redirect('/login');
	}

	return (
		<header className={styles.header}>
			<Link href='/'>
				<h1>Taskbridge</h1>
			</Link>
			<nav>
				{user && (
					<form action={logoutUser}>
						<h3>Welcome, {user.name}!</h3>
						<button className='button'>Logout</button>
					</form>
				)}
				{!user && <Link href='/login'>Login</Link>}
			</nav>
		</header>
	);
}
