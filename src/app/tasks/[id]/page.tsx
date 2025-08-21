import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
	ArrowLeftIcon,
	CalendarIcon,
	ClockIcon,
	CheckCircleIcon,
	UserIcon,
	UsersIcon,
	ListBulletIcon
} from '@heroicons/react/24/outline';

import type { Task } from '@/app/lib/types';
import { getUserLabel, getSingleTask } from '@/app/lib/query';

import styles from '../../styles/TaskDetail.module.css';

interface Props {
	params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: Props) {
	const { id } = await params;

	const task: Task = (await getSingleTask(id)) as Task;

	if (!task) {
		notFound();
	}

	const getStatusClass = (status: Task['status']) => {
		switch (status) {
			case 'pending':
				return styles.statusPending;
			case 'in_progress':
				return styles.statusInProgress;
			case 'done':
				return styles.statusDone;
			default:
				return '';
		}
	};

	const owner = await getUserLabel(task.ownerId);

	const sharedWith = task.sharedWith && (await Promise.all(task.sharedWith.map(getUserLabel)));

	return (
		<div className={styles.container}>
			<Link href='/' className={styles.backLink}>
				<ArrowLeftIcon width={20} height={20} />
				Back to home
			</Link>

			<div className={styles.taskCard}>
				<div className={styles.header}>
					<h1 className={styles.title}>{task.title}</h1>
					<span className={`${styles.status} ${getStatusClass(task.status)}`}>
						{task.status.replace(/_/g, ' ')}
					</span>
				</div>

				{task.description && <p className={styles.description}>{task.description}</p>}

				<div className={styles.metaGrid}>
					<div className={styles.metaItem}>
						<UserIcon />
						<div>
							<div className={styles.metaLabel}>Owner</div>
							<div className={styles.metaValue}>{owner}</div>
						</div>
					</div>

					{task.list && (
						<div className={styles.metaItem}>
							<ListBulletIcon />
							<div>
								<div className={styles.metaLabel}>List</div>
								<div className={styles.metaValue}>{task.list}</div>
							</div>
						</div>
					)}

					<div className={styles.metaItem}>
						<ClockIcon />
						<div>
							<div className={styles.metaLabel}>Created at</div>
							<div className={styles.metaValue}>
								{task.createdAt.toDate().toLocaleDateString('es-ES', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</div>
						</div>
					</div>

					<div className={styles.metaItem}>
						<ClockIcon />
						<div>
							<div className={styles.metaLabel}>Updated at</div>
							<div className={styles.metaValue}>
								{task.updatedAt.toDate().toLocaleDateString('es-ES', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</div>
						</div>
					</div>

					{task.dueDate && (
						<div className={styles.metaItem}>
							<CalendarIcon />
							<div>
								<div className={styles.metaLabel}>Due date</div>
								<div className={styles.metaValue}>
									{task.dueDate.toDate().toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</div>
							</div>
						</div>
					)}

					{task.completedAt && (
						<div className={styles.metaItem}>
							<CheckCircleIcon />
							<div>
								<div className={styles.metaLabel}>Completed at</div>
								<div className={styles.metaValue}>
									{task.completedAt.toDate().toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</div>
							</div>
						</div>
					)}

					{sharedWith && sharedWith.length > 0 && (
						<div className={styles.metaItem}>
							<UsersIcon />
							<div>
								<div className={styles.metaLabel}>Shared with</div>
								<div className={styles.sharedList}>
									{sharedWith.map((userId: string, index: number) => (
										<span key={index} className={styles.sharedUser}>
											{userId}
										</span>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
