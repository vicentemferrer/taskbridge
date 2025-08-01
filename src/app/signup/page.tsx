'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { signupAction } from '@/app/lib/auth';

import styles from '../styles/AuthForm.module.css';

export default function SignUpPage() {
	const [state, formAction, isPending] = useActionState(signupAction, {
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
				<h2>Sign Up</h2>
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
						<label htmlFor='nick'>Nick</label>
						<input type='text' id='nick' name='nick' required />
						{state.errors?.nick && <p className={styles.errorMessage}>{state.errors.nick}</p>}
					</div>
					<div className={styles.formGroup}>
						<label htmlFor='password'>Password</label>
						<input type='password' id='password' name='password' required />
						{state.errors?.password && (
							<p className={styles.errorMessage}>{state.errors.password}</p>
						)}
					</div>
					<div className={styles.formGroup}>
						<label htmlFor='confirmPassword'>Confirm Password</label>
						<input type='password' id='confirmPassword' name='confirmPassword' required />
						{state.errors?.confirmPassword && (
							<p className={styles.errorMessage}>{state.errors.confirmPassword}</p>
						)}
					</div>
					<button type='submit' className={styles.submitButton} disabled={isPending}>
						{isPending ? 'Signing up...' : 'Sign Up'}
					</button>
				</form>
				<p className={styles.linkText}>
					Already have an account? <Link href='/login'>Login</Link>
				</p>
			</div>
		</div>
	);
}
