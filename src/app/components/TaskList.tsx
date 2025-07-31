import type { Task } from '@/app/lib/types';

import TaskComponent from './Task';

import styles from './TaskList.module.css';

interface Props {
	tasks: Task[];
}

export default function TaskList({ tasks }: Props) {
	if (!tasks || tasks.length === 0) {
		return <p className={styles.noTasks}>No tasks to display. Start adding some!</p>;
	}

	return (
		<div className={styles.taskListContainer}>
			{tasks.map((task) => (
				<TaskComponent key={task.id} task={task} />
			))}
		</div>
	);
}
