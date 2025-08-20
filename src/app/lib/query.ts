import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

import { db } from './firebase';
import { Task } from './types';
import { FirebaseError } from 'firebase/app';

export async function getTasks() {
	try {
		const querySnapshot = await getDocs(collection(db, 'tasks'));

		return querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));
	} catch (err) {
		if (err instanceof Error || err instanceof FirebaseError) {
			throw new Error(`getTasks failed: ${err.message}`);
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
