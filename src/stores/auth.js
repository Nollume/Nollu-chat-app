import { defineStore } from 'pinia'
import router from '@/router/index.js'
import { auth, colRefUsers, storage } from '../firebase/firebase'
import { useRoute } from 'vue-router'
import { ref as stRef, deleteObject } from 'firebase/storage'

import {
	createUserWithEmailAndPassword,
	signOut,
	signInWithEmailAndPassword,
	updateProfile,
	updateEmail,
	deleteUser,
	onAuthStateChanged,
	sendEmailVerification,
	sendPasswordResetEmail,
} from 'firebase/auth'
import {
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore'
import { useFirestore } from './firestore'

export const useAuthStore = defineStore({
	id: 'auth',
	state: () => ({
		passwordMatch: false,
		errNameExist: '',
		nameExist: false,
		errMessage: '',
		errorLogin: '',
		errorDeleteUser: '',
		emailValid: true,
		user: null,
		numberOfRequest: 0,
		emailExist: false,
		errEmailExist: '',
		errChangeEmail: '',
		errChangeName: '',
		messageAfterRessetEmail: '',
	}),
	getters: {
		isLogin(state) {
			if (state.user !== null) return true
			return false
		},
	},
	actions: {
		validateEmail(email) {
			// eslint-disable-next-line
			let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
			if (email.match(regexEmail)) {
				return (this.emailValid = true)
			} else {
				return (this.emailValid = false)
			}
		},
		userNameAlreadyExist(userName) {
			const fireStore = useFirestore()

			const nameIsTaken = fireStore.users.some(
				(user) => user.userName === userName
			)
			this.nameExist = nameIsTaken
			this.errNameExist = 'Username already in use'
		},
		emailAlreadyExist(email) {
			const fireStore = useFirestore()

			const emailIsUsed = fireStore.users.some(
				(user) => user.userEmail === email
			)
			this.emailExist = emailIsUsed
			this.errEmailExist = 'Email already in use'
		},

		async registerNewUser(
			email,
			password,
			confirmPassword,
			userName,
			gender,
			dateOfBirth
		) {
			if (password === confirmPassword) {
				this.passwordMatch = true
			} else {
				this.passwordMatch = false
			}

			if (this.passwordMatch && this.validateEmail(email) && !this.nameExist) {
				this.user = []
				await createUserWithEmailAndPassword(auth, email, password)
					.then((cred) => {
						this.user = cred.user
						this.updateUserNameRegister(userName)
						cred.user.displayName = userName
						const { displayName, email, photoURL, emailVerified, uid } =
							cred.user
						this.sendVerificationEmail()

						this.addUserDoc(
							displayName,
							email,
							photoURL,
							emailVerified,
							uid,
							cred.user.metadata.creationTime,
							gender,
							dateOfBirth
						)
						router.push({ name: 'home' })
					})
					.then(() => {
						setTimeout(() => {
							window.location.reload()
						}, 1000)
					})
					.catch((err) => {
						if (err.code === 'auth/weak-password')
							return (this.errMessage =
								'Password must have at least 6 characters')
						if (err.code === 'auth/email-already-in-use')
							return (this.errMessage = 'The entered email is already in use')
						if (err.code === 'auth/network-request-failed')
							return (this.errMessage = 'No internet connection')
					})
			}
		},
		async addUserDoc(
			name,
			email,
			photo,
			emailVerified,
			id,
			createdAt,
			gender,
			dateOfBirth
		) {
			try {
				await addDoc(colRefUsers, {
					userName: name,
					userEmail: email,
					userPhoto: photo,
					uId: id,
					emailVerified: emailVerified,
					createdAt: createdAt,
					gender: gender,
					dateOfBirth: dateOfBirth,
					friends: [],
					notification: [],
					online: 'offline',
				})
			} catch (e) {
				console.error(e.message)
			}
		},

		updateUserNameRegister(userName) {
			updateProfile(auth.currentUser, {
				displayName: userName,
			}).then(() => {
				router.push({ name: 'home' })
			})
		},
		async updateUserName(userName) {
			const fireStore = useFirestore()
			const filterUserDb = fireStore.users.filter((user) => {
				return user.uId === auth.currentUser.uid
			})
			if (!this.nameExist) {
				const docRef = doc(colRefUsers, filterUserDb[0].id)
				await updateDoc(docRef, { userName: userName })
				updateProfile(auth.currentUser, {
					displayName: userName,
				})
					.then(() => {
						router.push({ name: 'home' })
					})
					.catch((err) => {
						console.error(err.code)
						switch (err.code) {
							case 'auth/requires-recent-login':
								this.errChangeName = 'Requires recent login'
								break
						}
					})
			}
		},
		updateEmailAddress(email) {
			const fireStore = useFirestore()
			const filterUserDb = fireStore.users.filter((user) => {
				return user.uId === auth.currentUser.uid
			})
			if (!this.emailExist && this.validateEmail(email)) {
				updateEmail(auth.currentUser, email)
					.then(() => {
						const docRef = doc(colRefUsers, filterUserDb[0].id)
						updateDoc(docRef, { userEmail: email })
						router.push({ name: 'home' })
					})
					.catch((err) => {
						console.error(err.code)
						switch (err.code) {
							case 'auth/invalid-email':
								this.errChangeEmail = 'Invalid email'
								break
							case 'auth/requires-recent-login':
								this.errChangeEmail = 'Requires recent login'
								break
							case 'auth/email-already-in-use':
								this.errChangeEmail = 'Email already in use'
								break
						}
					})
			}
		},
		sendVerificationEmail() {
			sendEmailVerification(auth.currentUser)
		},
		sendAPasswordResetEmail(email, form) {
			if (!email) return
			sendPasswordResetEmail(auth, email)
				.then(() => {
					form.reset()
					this.messageAfterRessetEmail =
						'Check your email to reset your password'
					setTimeout(() => {
						router.push({ name: 'login' })
					}, 5000)
				})
				.catch((error) => {
					console.log(error.code)
				})
		},

		logOut() {
			const q = query(colRefUsers, where('uId', '==', this.user.uid))
			getDocs(q).then((snapshot) => {
				let user = {}
				snapshot.docs.forEach((doc) => {
					user = { ...doc.data(), id: doc.id }
				})
				const docRef = doc(colRefUsers, user.id)

				updateDoc(docRef, { online: 'offline' })

				signOut(auth)
					.then(() => {
						this.user = null
						router.push({ name: 'login' })
						this.errorDeleteUser = ''
						setTimeout(() => {
							window.location.reload()
						}, 10)
					})
					.catch((err) => {
						this.errMessage = err.message
					})
			})
		},
		async logIn(email, password) {
			this.user = []
			await signInWithEmailAndPassword(auth, email, password)
				.then((cred) => {
					this.user = cred.user
					router.push({ name: 'home' })
				})
				.then(() => {
					setTimeout(() => {
						window.location.reload()
					}, 10)
				})
				.catch((err) => {
					switch (err.code) {
						case 'auth/user-not-found':
							this.errorLogin = 'User not found'
							break
						case 'auth/wrong-password':
							this.errorLogin = 'Wrong password'
							break
						case 'auth/too-many-requests':
							this.errorLogin = 'Too many requests'
							break
						case 'auth/network-request-failed':
							this.errorLogin = 'No internet connection'
							break
						default:
							this.errorLogin = ''
							break
					}
				})
		},
		authStateChanged() {
			const route = useRoute()
			const unsub = onAuthStateChanged(auth, (user) => {
				if (!user) {
					router.replace('/login')
				} else if (route.path === '/login' || route.path === '/register') {
					router.replace('/')
				}

				const fireStore = useFirestore()
				fireStore.getNumberOfNewMessages(user?.uid)

				if (user) {
					if (!user.emailVerified) {
						router.replace('/')
					}
					this.userOnline(user.uid)
				}
				this.userOffline()

				unsub()
			})
		},
		userOnline(uid) {
			const q = query(colRefUsers, where('uId', '==', uid))
			getDocs(q).then((snapshot) => {
				let user = {}
				snapshot.docs.forEach((doc) => {
					user = { ...doc.data(), id: doc.id }
				})
				const docRef = doc(colRefUsers, user.id)

				updateDoc(docRef, { online: 'online' })
				document.addEventListener('visibilitychange', (e) => {
					document.visibilityState === 'hidden'
						? updateDoc(docRef, { online: 'offline' })
						: updateDoc(docRef, { online: 'online' })
				})
			})
		},
		userOffline() {
			const q = query(colRefUsers, where('uId', '==', this.user.uid))
			getDocs(q).then((snapshot) => {
				let user = {}
				snapshot.docs.forEach((doc) => {
					user = { ...doc.data(), id: doc.id }
				})
				const docRef = doc(colRefUsers, user.id)
				window.addEventListener('beforeunload', function (e) {
					e.preventDefault()
					updateDoc(docRef, { online: 'offline' })
				})
			})
		},

		deleteUser() {
			const fireStore = useFirestore()
			const filterUserDb = fireStore.users.filter((user) => {
				return user.uId === auth.currentUser.uid
			})

			const desertRef = stRef(
				storage,
				filterUserDb[0].id + '/' + filterUserDb[0].fileName
			)
			deleteObject(desertRef)

			const docRef = doc(colRefUsers, filterUserDb[0].id)
			deleteDoc(docRef)
			deleteUser(auth.currentUser)
				.then(() => {
					router.push({ name: 'login' })
				})
				.catch((err) => {
					switch (err.code) {
						case 'auth/requires-recent-login':
							this.errorDeleteUser = 'Requires recent login'
							break
						default:
							this.errorDeleteUser = ''
							break
					}
				})
		},
	},
})

const unsub = onAuthStateChanged(auth, (user) => {
	const store = useAuthStore()
	store.user = user
	unsub()
})
