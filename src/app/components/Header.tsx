import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
	return (
		<header className={styles.header}>
			<Link href='/'>
				<h1>Taskbridge</h1>
			</Link>
			<nav>
				<Link href='/login'>Login</Link>
			</nav>
		</header>
	);
}
