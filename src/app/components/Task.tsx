import { CalendarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

import type { Task } from '@/app/lib/types';

import styles from './Task.module.css';

interface Props {
	task: Task;
}

export default function TaskComponent({ task }: Props) {
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

	return (
		<div className={styles.taskCard}>
			<div className={styles.taskHeader}>
				<h3 className={styles.taskTitle}>{task.title}</h3>
				<span className={`${styles.taskStatus} ${getStatusClass(task.status)}`}>
					{task.status.replace(/_/g, ' ')}
				</span>
			</div>
			{task.description && <p className={styles.taskDescription}>{task.description}</p>}
			<div className={styles.taskMeta}>
				{task.dueDate && (
					<>
						<CalendarIcon />
						<span>Due: {task.dueDate.toDate().toLocaleDateString()}</span>
					</>
				)}
				{task.completedAt && (
					<>
						<CheckCircleIcon />
						<span>Completed: {task.completedAt.toDate().toLocaleDateString()}</span>
					</>
				)}
				{!task.dueDate && !task.completedAt && (
					<>
						<ClockIcon />
						<span>Created: {task.createdAt.toDate().toLocaleDateString()}</span>
					</>
				)}
			</div>
		</div>
	);
}
