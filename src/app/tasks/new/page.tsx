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
					<h1 className={styles.title}>Crear nueva tarea</h1>
				</div>
				{state?.message && (
					<p className={state.success ? styles.success : styles.error}>{state.message}</p>
				)}

				<form action={formAction} className={styles.form}>
					<div className={`${styles.row} ${styles.rowTwo}`}>
						<div className={styles.group}>
							<label htmlFor='title'>Título</label>
							<input
								className={styles.input}
								id='title'
								name='title'
								type='text'
								placeholder='Ej. Comprar víveres'
								required
							/>
							{state?.errors?.title && <p className={styles.error}>{state.errors.title}</p>}
						</div>

						<div className={styles.group}>
							<label htmlFor='status'>Estado</label>
							<select
								className={styles.select}
								id='status'
								name='status'
								defaultValue='pending'
								required>
								<option value='pending'>Pending</option>
								<option value='in_progress'>In progress</option>
								<option value='done'>Done</option>
							</select>
							{state?.errors?.status && <p className={styles.error}>{state.errors.status}</p>}
						</div>
					</div>

					<div className={styles.group}>
						<label htmlFor='description'>Descripción</label>
						<textarea
							className={styles.textarea}
							id='description'
							name='description'
							placeholder='Detalles de la tarea (opcional)'
						/>
						{state?.errors?.description && (
							<p className={styles.error}>{state.errors.description}</p>
						)}
					</div>

					<div className={`${styles.row} ${styles.rowThree}`}>
						<div className={styles.group}>
							<label htmlFor='list'>Lista</label>
							<input
								className={styles.input}
								id='list'
								name='list'
								type='text'
								placeholder='Ej. Personal'
							/>
							{state?.errors?.list && <p className={styles.error}>{state.errors.list}</p>}
						</div>

						<div className={styles.group}>
							<label htmlFor='ownerId'>Owner UID</label>
							<input
								className={styles.input}
								id='ownerId'
								name='ownerId'
								type='text'
								placeholder='UID del creador'
								required
							/>
							{state?.errors?.ownerId && <p className={styles.error}>{state.errors.ownerId}</p>}
							<p className={styles.hint}>
								En producción se establecerá desde la sesión (Firebase Auth).
							</p>
						</div>

						<div className={styles.group}>
							<label htmlFor='sharedWith'>Compartida con (UIDs)</label>
							<input
								className={styles.input}
								id='sharedWith'
								name='sharedWith'
								type='text'
								placeholder='uid1, uid2, uid3'
							/>
							{state?.errors?.sharedWith && (
								<p className={styles.error}>{state.errors.sharedWith}</p>
							)}
							<p className={styles.hint}>Separar por comas para múltiples UIDs.</p>
						</div>
					</div>

					<div className={`${styles.row} ${styles.rowThree}`}>
						<div className={styles.group}>
							<label htmlFor='dueDate'>Fecha límite</label>
							<input className={styles.input} id='dueDate' name='dueDate' type='date' />
							{state?.errors?.dueDate && <p className={styles.error}>{state.errors.dueDate}</p>}
						</div>

						<div className={styles.group}>
							<label htmlFor='priority'>Prioridad (1–5)</label>
							<input
								className={styles.input}
								id='priority'
								name='priority'
								type='number'
								min={1}
								max={5}
								inputMode='numeric'
							/>
							{state?.errors?.priority && <p className={styles.error}>{state.errors.priority}</p>}
						</div>

						<div className={styles.group}>
							<label htmlFor='completedAt'>Fecha de finalización</label>
							<input className={styles.input} id='completedAt' name='completedAt' type='date' />
							{state?.errors?.completedAt && (
								<p className={styles.error}>{state.errors.completedAt}</p>
							)}
							<p className={styles.hint}>Solo válida si el estado es done.</p>
						</div>
					</div>

					<div className={styles.actions}>
						<button type='submit' className={styles.submit} disabled={pending}>
							{pending ? 'Creando...' : 'Crear tarea'}
						</button>
						<Link href='/' className={styles.secondary}>
							Cancelar
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
