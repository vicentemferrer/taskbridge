'use client';

import { useState, useTransition } from 'react';
import type { Task } from '@/app/lib/types';

import { updateTaskStatusAction } from '@/app/actions/tasks';

import styles from './StatusBadge.module.css';

interface Props {
	taskId: string;
	currentStatus: Task['status'];
	className?: string;
}

export default function StatusBadge({ taskId, currentStatus, className = '' }: Props) {
	const [status, setStatus] = useState(currentStatus);
	const [isPending, startTransition] = useTransition();

	const getStatusText = (status: Task['status']) => {
		switch (status) {
			case 'pending':
				return 'Pending';
			case 'in_progress':
				return 'In Progress';
			case 'done':
				return 'Done';
			default:
				return status;
		}
	};

	const getNextStatusText = (status: Task['status']) => {
		switch (status) {
			case 'pending':
				return 'Mark as in progress';
			case 'in_progress':
				return 'Mark as done';
			case 'done':
				return 'Mark as pending';
			default:
				return 'Change status';
		}
	};

	const handleStatusChange = () => {
		startTransition(async () => {
			const result = await updateTaskStatusAction(taskId, status);
			if (result.success && result.newStatus) {
				setStatus(result.newStatus);
			} else {
				console.error('Error updating status:', result.error);
			}
		});
	};

	return (
		<button
			onClick={handleStatusChange}
			disabled={isPending}
			className={`${styles.statusBadge} ${styles[status]} ${className} ${
				isPending ? styles.loading : ''
			}`}
			title={getNextStatusText(status)}
			aria-label={`Current State: ${getStatusText(status)}. Click for ${getNextStatusText(
				status
			).toLowerCase()}`}>
			{isPending ? <span className={styles.spinner}></span> : null}
			{getStatusText(status)}
		</button>
	);
}
