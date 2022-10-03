import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

import { getAuth } from 'firebase/auth'
import { collection, getFirestore, orderBy, query } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: import.meta.env.VITE_APP_KEY,
	authDomain: 'nollu-9fc76.firebaseapp.com',
	projectId: 'nollu-9fc76',
	storageBucket: 'nollu-9fc76.appspot.com',
	messagingSenderId: '9857766490',
	appId: '1:9857766490:web:802d635d26528fbb9cb463',
	databaseURL:
		'https://nollu-9fc76-default-rtdb.europe-west1.firebasedatabase.app',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth()
export const db = getFirestore(app)
export const storage = getStorage(app)

export const colRefMessages = collection(db, 'messages')

export const colRefUsers = collection(db, 'users')
export const usersQuery = query(colRefUsers, orderBy('createdAt', 'asc'))
