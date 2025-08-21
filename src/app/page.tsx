import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

import type { Task } from './lib/types';
import { getTasks } from './lib/query';

import TaskList from './components/TaskList';

import styles from './styles/Home.module.css';

interface ITasksDashboard {
	mine: Task[];
	shared: Task[];
}

export default async function HomePage() {
	const tasks = (await getTasks()) as ITasksDashboard;

	return (
		<div className={styles.homeContainer}>
			<div className={styles.listHeader}>
				<h2>Your Tasks</h2>
				<Link href='/tasks/new' className='button'>
					<PlusIcon width={24} height={24} /> New task
				</Link>
			</div>
			<TaskList tasks={tasks.mine} />
			{tasks.shared && tasks.shared.length > 0 && (
				<>
					<div className={styles.listHeader}>
						<h2>Shared Tasks</h2>
					</div>
					<TaskList tasks={tasks.shared} />
				</>
			)}
		</div>
	);
}
