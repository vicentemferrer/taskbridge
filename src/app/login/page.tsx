'use client';

import type { FormEvent } from 'react';

import { useState } from 'react';
import Link from 'next/link';

import styles from '../styles/AuthForm.module.css';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		console.log('Login attempt:', { email, password });
		alert('Login functionality not yet implemented. Check console for data.');
	};

	return (
		<div className={styles.authContainer}>
			<div className={styles.authCard}>
				<h2>Login</h2>
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
					<button type='submit' className={styles.submitButton}>
						Login
					</button>
				</form>
				<p className={styles.linkText}>
					Do not have an account? <Link href='/signup'>Sign Up</Link>
				</p>
			</div>
		</div>
	);
}
