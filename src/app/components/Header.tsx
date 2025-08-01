import Link from 'next/link';

import { auth } from '../lib/firebase';
import { logoutAction } from '../lib/auth';

import styles from './Header.module.css';

export default function Header() {
	const user = auth.currentUser;

	return (
		<header className={styles.header}>
			<Link href='/'>
				<h1>Taskbridge</h1>
			</Link>
			<nav>
				{user && (
					<form action={logoutAction}>
						<h3>Welcome, {user.displayName}!</h3>
						<button className='button'>Logout</button>
					</form>
				)}
				{!user && <Link href='/login'>Login</Link>}
			</nav>
		</header>
	);
}
