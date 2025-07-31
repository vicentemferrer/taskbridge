import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

import './styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Taskbridge - Your Personal Task Manager',
	description: 'Organize your personal tasks with Taskbridge, a simple web-based task manager.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Header />
				<main
					style={{
						minHeight: 'calc(100vh - 120px)',
						padding: '2rem',
						maxWidth: '1200px',
						margin: '0 auto'
					}}>
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
