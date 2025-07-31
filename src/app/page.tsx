import type { Task, TimestampMock } from './lib/types';

import TaskList from './components/TaskList';

import styles from './styles/Home.module.css';

const mockTimestamp = (date: Date): TimestampMock => ({
	toDate: () => date
});

const sampleTasks: Task[] = [
	{
		id: 'task1',
		title: 'Plan weekly team meeting',
		description: 'Prepare agenda, invite attendees, and book a room.',
		status: 'in_progress',
		list: 'Work',
		ownerId: 'user123',
		createdAt: mockTimestamp(new Date('2024-07-20T10:00:00Z')),
		updatedAt: mockTimestamp(new Date('2024-07-25T14:30:00Z')),
		dueDate: mockTimestamp(new Date('2024-08-01T17:00:00Z')),
		priority: 5
	},
	{
		id: 'task2',
		title: 'Buy groceries',
		description: 'Milk, eggs, bread, and vegetables.',
		status: 'pending',
		list: 'Personal',
		ownerId: 'user123',
		createdAt: mockTimestamp(new Date('2024-07-24T09:00:00Z')),
		updatedAt: mockTimestamp(new Date('2024-07-24T09:00:00Z')),
		dueDate: mockTimestamp(new Date('2024-07-30T19:00:00Z')),
		priority: 3
	},
	{
		id: 'task3',
		title: 'Finish report for Q3',
		description: 'Compile all data and write conclusions.',
		status: 'done',
		list: 'Work',
		ownerId: 'user123',
		sharedWith: ['user456'],
		createdAt: mockTimestamp(new Date('2024-07-01T08:00:00Z')),
		updatedAt: mockTimestamp(new Date('2024-07-22T11:00:00Z')),
		completedAt: mockTimestamp(new Date('2024-07-22T11:00:00Z')),
		priority: 4
	},
	{
		id: 'task4',
		title: 'Call plumber',
		description: 'Leaky faucet in the kitchen.',
		status: 'pending',
		list: 'Home',
		ownerId: 'user123',
		createdAt: mockTimestamp(new Date('2024-07-26T15:00:00Z')),
		updatedAt: mockTimestamp(new Date('2024-07-26T15:00:00Z')),
		priority: 2
	},
	{
		id: 'task5',
		title: 'Read "The Great Gatsby"',
		description: 'For book club meeting next month.',
		status: 'in_progress',
		list: 'Personal',
		ownerId: 'user123',
		createdAt: mockTimestamp(new Date('2024-07-10T18:00:00Z')),
		updatedAt: mockTimestamp(new Date('2024-07-25T09:00:00Z')),
		priority: 1
	}
];

export default function HomePage() {
	return (
		<div className={styles.homeContainer}>
			<h2>Your Tasks</h2>
			<TaskList tasks={sampleTasks} />
		</div>
	);
}
