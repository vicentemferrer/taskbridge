'use client';

import Link from 'next/link';
import {
	ExclamationTriangleIcon,
	HomeIcon,
	PlusCircleIcon,
	ArrowLeftIcon
} from '@heroicons/react/24/outline';

import styles from './styles/NotFound.module.css';

export default function NotFoundPage() {
	return (
		<div className={styles.container}>
			<div className={styles.iconContainer}>
				<ExclamationTriangleIcon className={styles.icon} />
			</div>

			<h1 className={styles.title}>404</h1>
			<h2 className={styles.subtitle}>Page Not Found</h2>

			<p className={styles.description}>
				We&apos;re sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. The
				link may be broken or you may have misspelled the address.
			</p>

			<div className={styles.actions}>
				<Link href='/' className={styles.primaryButton}>
					<HomeIcon width={20} height={20} />
					Home
				</Link>

				<Link href='/tasks/new' className={styles.secondaryButton}>
					<PlusCircleIcon width={20} height={20} />
					Create task
				</Link>

				<button onClick={() => window.history.back()} className={styles.secondaryButton}>
					<ArrowLeftIcon width={20} height={20} />
					Go back
				</button>
			</div>

			<div className={styles.helpText}>
				<p>
					Need help? Return to the <Link href='/'>homepage</Link> to see all your assignments.
				</p>
			</div>
		</div>
	);
}
