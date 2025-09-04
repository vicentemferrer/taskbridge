'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import {
	ArrowLeftIcon,
	CalendarIcon,
	ClockIcon,
	CheckCircleIcon,
	UserIcon,
	UsersIcon,
	ListBulletIcon
} from '@heroicons/react/24/outline';

import { flattenTask, type PlainTask, type Task } from '@/app/lib/types';
import { db } from '@/app/lib/firebase';

import StatusBadge from '@/app/components/StatusBadge';

import styles from '@/app/styles/TaskDetail.module.css';

interface ClientProps {
	id: string;
	owner: string;
	sharedWith: string[] | false;
	initialTask: PlainTask;
}

export default function RealtimeTask({ id, owner, sharedWith, initialTask }: ClientProps) {
	const [task, setTask] = useState<PlainTask>(initialTask);

	useEffect(() => {
		const unsubscribe = onSnapshot(doc(collection(db, 'tasks'), id), (snapshot) => {
			if (snapshot.exists()) {
				setTask(flattenTask({ ...snapshot.data() } as Task));
			}
		});
		return () => unsubscribe();
	}, [id]);

	return (
		<div className={styles.container}>
			<Link href='/' className={styles.backLink}>
				<ArrowLeftIcon width={20} height={20} />
				Back to home
			</Link>

			<div className={styles.taskCard}>
				<div className={styles.header}>
					<h1 className={styles.title}>{task.title}</h1>
					<StatusBadge taskId={id} currentStatus={task.status} />
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
								{task.createdAt.toLocaleDateString('es-ES', {
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
								{task.updatedAt.toLocaleDateString('es-ES', {
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
									{task.dueDate.toLocaleDateString('en-US', {
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
									{task.completedAt.toLocaleDateString('en-US', {
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

					{sharedWith && (
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
