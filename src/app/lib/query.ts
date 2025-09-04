import {
	collection,
	deleteField,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

import { db } from './firebase';
import { Task } from './types';
import { auth } from './firebaseAdmin';

import { getUserFromSession } from '../actions/adminAuth';

export async function getTasks() {
	try {
		const user = await getUserFromSession();

		const tasksRef = collection(db, 'tasks');

		const myTasksQuery = query(tasksRef, where('ownerId', '==', user?.uid));
		const sharedTasksQuery = query(tasksRef, where('sharedWith', 'array-contains', user?.uid));

		const myTasks = await getDocs(myTasksQuery);
		const sharedTasks = await getDocs(sharedTasksQuery);

		return {
			mine: myTasks.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			})),
			shared: sharedTasks.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}))
		};
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			console.error(`getTasks failed: ${err.message}`);
		}
	}
}

export async function getSingleTask(id: string) {
	try {
		const user = await getUserFromSession();

		const docSnapshot = await getDoc(doc(db, 'tasks', id));

		const isAble =
			docSnapshot.get('ownerId') === user?.uid || docSnapshot.get('sharedWith').includes(user?.uid);

		return isAble && { ...docSnapshot.data() };
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			console.error(`getSingleTask failed: ${err.message}`);
		}
	}
}

export async function createTask(data: Omit<Task, 'id'>) {
	try {
		const newTaskRef = doc(collection(db, 'tasks'));

		await setDoc(newTaskRef, data);
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			throw new Error(`createTask failed: ${err.message}`);
		}
	}
}

export async function updateTask(id: string, fields: Partial<Omit<Task, 'id'>>) {
	try {
		const taskRef = doc(collection(db, 'tasks'), id);

		await updateDoc(taskRef, {
			...fields,
			updatedAt: serverTimestamp(),
			...(fields?.status === 'done'
				? { completedAt: serverTimestamp() }
				: { completedAt: deleteField() })
		});
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			throw new Error(`updateTask failed: ${err.message}`);
		}
	}
}

export async function getUserLabel(uid: string) {
	try {
		const user = await getUserFromSession();

		if (uid === user?.uid) return 'You';

		const notMyUser = await auth.getUser(uid);

		return notMyUser.displayName as string;
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			console.error(`getUserLabel failed: ${err.message}`);
		}

		return '';
	}
}
