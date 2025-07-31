'use client';

import type { FormEvent } from 'react';

import { useState } from 'react';
import Link from 'next/link';

import styles from '../styles/AuthForm.module.css';

export default function SignUpPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert('Passwords do not match!');
			return;
		}

		console.log('Sign Up attempt:', { email, password });
		alert('Sign Up functionality not yet implemented. Check console for data.');
	};

	return (
		<div className={styles.authContainer}>
			<div className={styles.authCard}>
				<h2>Sign Up</h2>
				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.formGroup}>
						<label htmlFor='email'>Email</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor='password'>Password</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor='confirmPassword'>Confirm Password</label>
						<input
							type='password'
							id='confirmPassword'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<button type='submit' className={styles.submitButton}>
						Sign Up
					</button>
				</form>
				<p className={styles.linkText}>
					Already have an account? <Link href='/login'>Login</Link>
				</p>
			</div>
		</div>
	);
}
