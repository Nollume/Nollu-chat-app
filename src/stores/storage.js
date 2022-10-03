import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { storage, usersQuery, colRefUsers } from '../firebase/firebase'
import {
	ref as stRef,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from 'firebase/storage'
import { doc, updateDoc, getDocs } from 'firebase/firestore'

export const useStorageStore = defineStore({
	id: 'storage',
	state: () => ({}),
	getters: {},
	actions: {
		handleFileUpload(event) {
			const authStore = useAuthStore()

			const file = event.target.files[0]

			getDocs(usersQuery).then((snapshot) => {
				let users = []
				snapshot.docs.forEach((doc) => {
					users.push({ ...doc.data(), id: doc.id })
				})
				const refToCurrentUser = users.find(
					(user) => user.uId === authStore.user.uid
				)
				const docRef = doc(colRefUsers, refToCurrentUser.id)

				if (refToCurrentUser.fileName) {
					const deleteStorageRef = stRef(
						storage,
						refToCurrentUser.id + '/' + refToCurrentUser.fileName
					)
					deleteObject(deleteStorageRef)
				}

				const storageRef = stRef(storage, refToCurrentUser.id + '/' + file.name)

				uploadBytes(storageRef, file).then(() => {
					updateDoc(docRef, { fileName: file.name })
					getDownloadURL(storageRef).then((url) => {
						updateDoc(docRef, { userPhoto: url })
					})
				})
			})
		},
	},
})
