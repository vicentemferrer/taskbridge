import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
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
			throw new Error(`getTasks failed: ${err.message}`);
		}
	}
}

export async function getSingleTask(id: string) {
	try {
		const docSnapshot = await getDoc(doc(db, 'tasks', id));

		return { ...docSnapshot.data() };
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			throw new Error(`getSingleTask failed: ${err.message}`);
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

export async function getUserLabel(uid: string) {
	try {
		const user = await getUserFromSession();

		if (uid === user?.uid) return 'You';

		const notMyUser = await auth.getUser(uid);

		return notMyUser.displayName;
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			throw new Error(`getOwnerLabel failed: ${err.message}`);
		}
	}
}
