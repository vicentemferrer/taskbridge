'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import { createTaskAction } from '@/app/actions/tasks';

import styles from '@/app/styles/NewTaskForm.module.css';

type State = Awaited<ReturnType<typeof createTaskAction>>;

export default function NewTaskPage() {
	const [state, formAction, pending] = useActionState<State, FormData>(createTaskAction, {
		success: false,
		errors: {},
		message: ''
	});

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<div className={styles.header}>
					<PlusCircleIcon width={24} height={24} />
					<h1 className={styles.title}>New Task</h1>
				</div>
				{state?.message && (
					<p className={state.success ? styles.success : styles.error}>{state.message}</p>
				)}

				<form action={formAction} className={styles.form}>
					<div className={`${styles.row} ${styles.rowTwo}`}>
						<div className={styles.group}>
							<label htmlFor='title'>Name</label>
							<input
								className={styles.input}
								id='title'
								name='title'
								type='text'
								placeholder='Ex. Buy food'
								required
							/>
							{state?.errors?.title && <p className={styles.error}>{state.errors.title}</p>}
						</div>
					</div>

					<div className={`${styles.row} ${styles.rowTwo}`}>
						<div className={styles.group}>
							<label htmlFor='description'>Description</label>
							<textarea
								className={styles.textarea}
								id='description'
								name='description'
								placeholder='Task details (optional)'
								required
							/>
							{state?.errors?.description && (
								<p className={styles.error}>{state.errors.description}</p>
							)}
						</div>
					</div>

					<div className={`${styles.row} ${styles.rowTwo}`}>
						<div className={styles.group}>
							<label htmlFor='list'>Task List</label>
							<input
								className={styles.input}
								id='list'
								name='list'
								type='text'
								placeholder='Ex. Personal'
								required
							/>
							{state?.errors?.list && <p className={styles.error}>{state.errors.list}</p>}
						</div>
					</div>

					<div className={`${styles.row} ${styles.rowTwo}`}>
						<div className={styles.group}>
							<label htmlFor='dueDate'>Due Date</label>
							<input className={styles.input} id='dueDate' name='dueDate' type='date' required />
							{state?.errors?.dueDate && <p className={styles.error}>{state.errors.dueDate}</p>}
						</div>
					</div>

					<div className={styles.actions}>
						<button type='submit' className={styles.submit} disabled={pending}>
							{pending ? 'Creating...' : 'Create Task'}
						</button>
						<Link href='/' className={styles.secondary}>
							Cancel
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
