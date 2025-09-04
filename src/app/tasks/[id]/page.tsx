import { notFound } from 'next/navigation';

import { flattenTask, type Task } from '@/app/lib/types';
import { getUserLabel, getSingleTask } from '@/app/lib/query';

import RealtimeTask from '@/app/components/RealtimeTask';

interface Props {
	params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: Props) {
	const { id } = await params;

	const task: Task = (await getSingleTask(id)) as Task;

	if (!task) {
		notFound();
	}

	const owner = await getUserLabel(task.ownerId);

	const sharedWith =
		task.sharedWith &&
		task.sharedWith.length > 0 &&
		(await Promise.all(task.sharedWith.map(getUserLabel)));

	return (
		<RealtimeTask id={id} owner={owner} sharedWith={sharedWith} initialTask={flattenTask(task)} />
	);
}
