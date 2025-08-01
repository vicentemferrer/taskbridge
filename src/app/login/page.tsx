'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';

import { loginAction } from '@/app/lib/auth';

import styles from '../styles/AuthForm.module.css';
import { redirect } from 'next/navigation';

export default function LoginPage() {
	const [state, formAction, isPending] = useActionState(loginAction, {
		success: false,
		errors: {},
		message: ''
	});

	useEffect(() => {
		if (state.success) {
			redirect('/');
		}
	}, [state]);

	return (
		<div className={styles.authContainer}>
			<div className={styles.authCard}>
				<h2>Login</h2>
				{state.message && (
					<p style={{ color: state.success ? 'green' : 'red', textAlign: 'center' }}>
						{state.message}
					</p>
				)}
				<form action={formAction} className={styles.form}>
					<div className={styles.formGroup}>
						<label htmlFor='email'>Email</label>
						<input type='email' id='email' name='email' required />
						{state.errors?.email && <p className={styles.errorMessage}>{state.errors.email}</p>}
					</div>
					<div className={styles.formGroup}>
						<label htmlFor='password'>Password</label>
						<input type='password' id='password' name='password' required />
						{state.errors?.password && (
							<p className={styles.errorMessage}>{state.errors.password}</p>
						)}
					</div>
					<button type='submit' className={styles.submitButton} disabled={isPending}>
						{isPending ? 'Logging in...' : 'Login'}
					</button>
				</form>
				<p className={styles.linkText}>
					Do not have an account? <Link href='/signup'>Sign Up</Link>
				</p>
			</div>
		</div>
	);
}
