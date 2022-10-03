import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { onUnmounted } from 'vue'
import {
	colRefMessages,
	usersQuery,
	colRefUsers,
	auth,
	db,
} from '../firebase/firebase'
import {
	onSnapshot,
	collection,
	collectionGroup,
	where,
	doc,
	addDoc,
	setDoc,
	orderBy,
	query,
	updateDoc,
	arrayRemove,
	arrayUnion,
	getDoc,
	serverTimestamp,
} from 'firebase/firestore'

export const useFirestore = defineStore({
	id: 'firestore',
	state: () => ({
		messages: [],
		users: [],
		userDoc: [],
		currentUser: false,
		sendRequest: false,
		receiver: false,
		friend: false,
		numberOfRequest: 0,
		receiverUsers: [],
		usersWhoAcceptRequest: [],
		userFriendsInProfile: [],
		usersWithMessage: [],
		lastMessage: [],
		messageRooms: [],
		numberOfNewMessages: 0,
	}),
	getters: {
		getUsersNotCurrentUser(state) {
			return state.users.filter((user) => user.uId !== auth?.currentUser.uid)
		},
		getCurrentUser(state) {
			const authStore = useAuthStore()
			return state.users.filter((user) => user.uId === authStore?.user.uid)
		},
		getCurrentUserFriends(state) {
			const authStore = useAuthStore()

			const currentUser = state.users.find(
				(user) => user.uId === authStore?.user.uid
			)

			const friends = currentUser?.friends
				.map((id) => {
					return state.users.filter((user) => {
						return user?.id === id
					})
				})
				.flat()

			const sortedFriends = friends?.sort((a, b) => {
				return a.userName < b.userName ? -1 : 1
			})

			return sortedFriends
		},
	},
	actions: {
		getUsers() {
			const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
				this.users = []
				snapshot.docs.forEach((doc) => {
					this.users.push({ ...doc.data(), id: doc.id })
				})
			})
			onUnmounted(unsubscribe)
		},
		async getUser(id) {
			const docRef = doc(colRefUsers, id)
			await onSnapshot(docRef, (doc) => {
				this.userDoc = []
				this.userDoc.push({ ...doc.data(), id: doc.id })
			})
		},
		clearUserArray() {
			this.userDoc = []
		},
		ifCurrentUserProfile(id) {
			const authStore = useAuthStore()
			const docRef = doc(colRefUsers, id)
			getDoc(docRef).then((doc) => {
				const user = doc.data()
				if (user.uId === authStore?.user.uid) return (this.currentUser = true)
				else return (this.currentUser = false)
			})
		},
		getSenderNotifications(id) {
			const authStore = useAuthStore()
			const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
				const users = []
				snapshot.docs.forEach((doc) => {
					users.push({ ...doc.data(), id: doc.id })
				})
				const currentUser = users.find(
					(user) => user.uId === authStore?.user.uid
				)

				if (!currentUser?.notification.length) return

				const allSender = currentUser?.notification.filter((item) => {
					return item.endsWith('sender')
				})

				const sender = allSender.find((item) => {
					return item.split(' ')[0] === id
				})
				sender ? (this.sendRequest = true) : (this.sendRequest = false)

				const allReceiver = currentUser?.notification.filter((item) => {
					return item.endsWith('receiver')
				})
				const findUsersWhoAcceptRequest = currentUser?.notification.filter(
					(item) => {
						return item.endsWith('acceptRequest')
					}
				)

				this.numberOfRequest =
					allReceiver.length + findUsersWhoAcceptRequest.length

				const receiver = allReceiver.find((item) => {
					return item.split(' ')[0] === id
				})
				receiver ? (this.receiver = true) : (this.receiver = false)
			})
			onUnmounted(unsubscribe)
		},

		async sendNotification(id) {
			const userRequestIsSent = this.users.filter((user) => {
				return user.id === id
			})
			const docRefCurrent = doc(colRefUsers, this.getCurrentUser[0].id)
			const docRefReqested = doc(colRefUsers, userRequestIsSent[0].id)
			await updateDoc(docRefCurrent, {
				notification: arrayUnion(userRequestIsSent[0].id + ' sender'),
			})
			await updateDoc(docRefReqested, {
				notification: arrayUnion(this.getCurrentUser[0].id + ' receiver'),
			})
		},
		async cancelFriendRequest(id) {
			const userRequestIsCanceled = this.users.find((user) => {
				return user.id === id
			})
			const docRefCurrent = doc(colRefUsers, this.getCurrentUser[0].id)
			const docRefReqested = doc(colRefUsers, userRequestIsCanceled.id)

			await updateDoc(docRefCurrent, {
				notification: arrayRemove(userRequestIsCanceled.id + ' sender'),
			})
			await updateDoc(docRefReqested, {
				notification: arrayRemove(this.getCurrentUser[0].id + ' receiver'),
			}).then(() => {
				this.sendRequest = false
			})
		},
		findUsersWhoSentNotification() {
			const authStore = useAuthStore()
			onSnapshot(usersQuery, (snapshot) => {
				this.receiverUsers = []
				const users = []
				snapshot.docs.forEach((doc) => {
					users.push({ ...doc.data(), id: doc.id })
				})
				const currentUser = users.find(
					(user) => user.uId === authStore?.user.uid
				)
				const allReceiver = currentUser.notification.filter((item) => {
					return item.endsWith('receiver')
				})

				const ids = allReceiver.map((item) => {
					return item.split(' ')[0]
				})

				const receivers = ids.map((id) => {
					return users.filter((user) => {
						return user.id === id
					})
				})
				this.receiverUsers = receivers.flat()

				const findUsersWhoAcceptRequest = currentUser?.notification.filter(
					(item) => {
						return item.endsWith('acceptRequest')
					}
				)
				const idUsersWhoAcceptRequest = findUsersWhoAcceptRequest.map(
					(item) => {
						return item.split(' ')[0]
					}
				)
				const usersWhoAcceptFriendRequest = idUsersWhoAcceptRequest
					.map((id) => {
						return users.filter((user) => {
							return user.id === id
						})
					})
					.flat()
				this.numberOfRequest =
					allReceiver.length + findUsersWhoAcceptRequest.length
				this.usersWhoAcceptRequest = usersWhoAcceptFriendRequest
			})
		},
		async declineFriendRequest(id) {
			const userWhosentRequest = this.users.find((user) => {
				return user.id === id
			})
			const docRefCurrent = doc(colRefUsers, this.getCurrentUser[0].id)
			const docRefReqested = doc(colRefUsers, userWhosentRequest.id)

			await updateDoc(docRefCurrent, {
				notification: arrayRemove(userWhosentRequest.id + ' receiver'),
			}).then(() => {
				this.sendRequest = false
			})
			await updateDoc(docRefReqested, {
				notification: arrayRemove(this.getCurrentUser[0].id + ' sender'),
			}).then(() => {
				this.sendRequest = false
			})
		},

		async addFriend(id) {
			const userWhosentRequest = this.users.find((user) => {
				return user.id === id
			})

			const docRefCurrent = doc(colRefUsers, this.getCurrentUser[0].id)
			const docRefReqested = doc(colRefUsers, userWhosentRequest.id)

			this.declineFriendRequest(id).then(() => {
				updateDoc(docRefCurrent, {
					friends: arrayUnion(userWhosentRequest.id),
				}).then(() => {})
				updateDoc(docRefReqested, {
					friends: arrayUnion(this.getCurrentUser[0].id),
				}).then(() => {
					this.sendRequest = false
					updateDoc(docRefReqested, {
						notification: arrayUnion(
							this.getCurrentUser[0].id + ' acceptRequest'
						),
					})
				})
			})
		},
		ifFriend(id) {
			const authStore = useAuthStore()
			onSnapshot(usersQuery, (snapshot) => {
				const users = []
				snapshot.docs.forEach((doc) => {
					users.push({ ...doc.data(), id: doc.id })
				})
				const actualUser = users.find((user) => {
					return user.id === id
				})
				const currentUser = users.find(
					(user) => user.uId === authStore.user.uid
				)
				const friend = actualUser?.friends.some((item) => {
					return item === currentUser.id
				})
				friend ? (this.friend = true) : (this.friend = false)
			})
		},
		async removeFriend(id) {
			const userForRemove = this.users.find((user) => {
				return user.id === id
			})
			const docRefCurrent = doc(colRefUsers, this.getCurrentUser[0].id)
			const docRefReqested = doc(colRefUsers, userForRemove.id)

			await updateDoc(docRefCurrent, {
				friends: arrayRemove(userForRemove.id),
			})
			await updateDoc(docRefReqested, {
				friends: arrayRemove(this.getCurrentUser[0].id),
			})
		},
		async deleteNotification(id) {
			const removeUserNotification = this.users.find((user) => {
				return user.id === id
			})
			const docRefCurrent = doc(colRefUsers, this.getCurrentUser[0].id)
			await updateDoc(docRefCurrent, {
				notification: arrayRemove(removeUserNotification.id + ' acceptRequest'),
			})
		},
		getUserFriends(id) {
			onSnapshot(usersQuery, (snapshot) => {
				const users = []
				snapshot.docs.forEach((doc) => {
					users.push({ ...doc.data(), id: doc.id })
				})

				this.userFriendsInProfile = []
				const userProfile = this.users.find((user) => {
					return user.id === id
				})
				const userFriends = userProfile?.friends
					.map((id) => {
						return users.filter((user) => {
							return user.id === id
						})
					})
					.flat()

				const sortedFriends = userFriends.sort((a, b) => {
					return a.userName < b.userName ? -1 : 1
				})

				this.userFriendsInProfile = sortedFriends
			})
		},
		async setMessageDoc(uid, id, displayName, userName) {
			await setDoc(doc(db, 'messages', uid + '' + id), {
				ids: [uid, id],
				roomNames: [displayName, userName],
				read: true,
				sender: '',
			})
		},
		createMessageDoc(id, userName) {
			const authStore = useAuthStore()
			const { uid, displayName } = authStore.user

			const docRef = doc(colRefMessages, uid + '' + id)
			const docReference = doc(colRefMessages, id + '' + uid)

			getDoc(docRef).then((document) => {
				let data = ''
				data = { ...document.data() }

				getDoc(docReference).then((document) => {
					let dataSecondary = ''
					dataSecondary = { ...document.data() }

					if (data.ids || dataSecondary.ids) {
						return
					} else {
						this.setMessageDoc(uid, id, displayName, userName)
					}
				})
			})
		},
		/**
		 *	Toggle document to true
		 */
		toggleIfRead(currentUserId, secondUserId, senderId) {
			if (currentUserId === senderId) return
			else {
				const docRef = doc(colRefMessages, currentUserId + '' + secondUserId)
				const docReference = doc(
					colRefMessages,
					secondUserId + '' + currentUserId
				)

				getDoc(docRef).then((document) => {
					let data = ''
					data = { ...document.data() }

					getDoc(docReference).then((document) => {
						let dataSecondary = ''
						dataSecondary = { ...document.data() }

						if (data.ids && !dataSecondary.ids) {
							updateDoc(docRef, { read: true })
						} else if (!data.ids && dataSecondary.ids) {
							updateDoc(docReference, { read: true })
						}
					})
				})
			}
		},
		ifMessageRead(currentUserId, secondUserId) {
			const docRef = doc(colRefMessages, currentUserId + '' + secondUserId)
			const docReference = doc(
				colRefMessages,
				secondUserId + '' + currentUserId
			)

			onSnapshot(docRef, (document) => {
				let data = ''
				data = { ...document.data() }

				onSnapshot(docReference, (document) => {
					let dataSecondary = ''
					dataSecondary = { ...document.data() }

					if (data.ids && !dataSecondary.ids) {
						this.messageRooms.push(data)
					} else if (!data.ids && dataSecondary.ids) {
						this.messageRooms.push(dataSecondary)
					}
				})
			})
		},
		clearRoomMessage() {
			this.messageRooms.length = 0
		},
		getNumberOfNewMessages(currentUserId) {
			const getMessagesRooms = query(
				colRefMessages,
				where('read', '==', false),
				where('ids', 'array-contains', currentUserId),
				where('sender', '!=', currentUserId)
			)
			onSnapshot(getMessagesRooms, (snapshot) => {
				const messages = []
				snapshot.docs.forEach((doc) => {
					messages.push({ ...doc.data(), id: doc.id })
				})

				this.numberOfNewMessages = messages.length
			})
		},
		writeMessages(id, text, form) {
			if (!text.length) return

			const authStore = useAuthStore()
			const { uid } = authStore.user

			const docRef = doc(colRefMessages, uid + '' + id)
			const docReference = doc(colRefMessages, id + '' + uid)

			getDoc(docRef).then((document) => {
				let data = ''
				data = { ...document.data() }

				getDoc(docReference).then((document) => {
					let dataSecondary = ''
					dataSecondary = { ...document.data() }

					if (data.ids && !dataSecondary.ids) {
						updateDoc(docRef, { read: false, sender: uid })
						addDoc(collection(db, 'messages', uid + '' + id, 'room'), {
							message: text,
							senderUser: uid,
							users: [uid, id],
							createdAt: serverTimestamp(),
						}).then(() => {
							form.reset()
						})
					} else if (!data.ids && dataSecondary.ids) {
						updateDoc(docReference, { read: false, sender: uid })
						addDoc(collection(db, 'messages', id + '' + uid, 'room'), {
							message: text,
							senderUser: uid,
							users: [uid, id],
							createdAt: serverTimestamp(),
						}).then(() => {
							form.reset()
						})
					}
				})
			})
		},
		getMessages(uid, id) {
			const docRef = doc(colRefMessages, uid + '' + id)
			const docReference = doc(colRefMessages, id + '' + uid)

			onSnapshot(docRef, (document) => {
				let data = ''
				data = { ...document.data() }

				onSnapshot(docReference, (document) => {
					let dataSecondary = ''
					dataSecondary = { ...document.data() }

					if (data.ids && !dataSecondary.ids) {
						const rooms = query(
							collection(db, 'messages/' + uid + '' + id + '/room'),
							orderBy('createdAt')
						)
						onSnapshot(rooms, (snapshot) => {
							this.messages = []
							snapshot.docs.forEach((message) => {
								this.messages.push({ ...message.data(), id: message.id })
							})
						})
					} else if (!data.ids && dataSecondary.ids) {
						const rooms = query(
							collection(db, 'messages/' + id + '' + uid + '/room'),
							orderBy('createdAt')
						)
						onSnapshot(rooms, (snapshot) => {
							this.messages = []
							snapshot.docs.forEach((message) => {
								this.messages.push({ ...message.data(), id: message.id })
							})
						})
					}
				})
			})
		},
		clearMessages() {
			this.messages = []
		},
		clearLastMessage() {
			this.lastMessage = []
		},
		getAllUsersWithMessages() {
			const authStore = useAuthStore()
			const { uid } = authStore.user
			const allSubCollRef = query(
				collectionGroup(db, 'room'),
				where('users', 'array-contains', uid),
				orderBy('createdAt', 'desc')
			)
			onSnapshot(allSubCollRef, (snapshot) => {
				const allMessages = []
				snapshot.docs.forEach((message) => {
					allMessages.push({ ...message.data(), id: message.id })
				})

				const ids = []
				allMessages.map((message) => {
					ids.push(message.users)
				})

				let unique = [...new Set(ids.join(',').split(','))]
				const usersNotCurrent = unique.filter((user) => {
					return user !== uid
				})

				onSnapshot(usersQuery, (snapshot) => {
					const users = []
					snapshot.docs.forEach((doc) => {
						users.push({ ...doc.data(), id: doc.id })
					})
					const usersMessage = usersNotCurrent
						.map((ids) => {
							return users.filter((user) => {
								return user.uId === ids
							})
						})
						.flat()

					this.usersWithMessage = usersMessage
				})
			})
		},
		getLastMessages(id) {
			const authStore = useAuthStore()
			const { uid } = authStore.user

			const docRef = doc(colRefMessages, uid + '' + id)
			const docReference = doc(colRefMessages, id + '' + uid)

			getDoc(docRef).then((document) => {
				let data = ''
				data = { ...document.data() }

				getDoc(docReference).then((document) => {
					let dataSecondary = ''
					dataSecondary = { ...document.data() }

					if (data.ids && !dataSecondary.ids) {
						const rooms = query(
							collection(db, 'messages/' + uid + '' + id + '/room'),
							orderBy('createdAt')
						)
						onSnapshot(rooms, (snapshot) => {
							let messages = []
							messages.length = 0
							snapshot.docs.forEach((message) => {
								messages.push({ ...message.data(), id: message.id })
							})

							this.lastMessage.push(messages.at(-1))
						})
					} else if (!data.ids && dataSecondary.ids) {
						const rooms = query(
							collection(db, 'messages/' + id + '' + uid + '/room'),
							orderBy('createdAt')
						)
						onSnapshot(rooms, (snapshot) => {
							let messages = []
							snapshot.docs.forEach((message) => {
								messages.push({ ...message.data(), id: message.id })
							})
							this.lastMessage.push(messages.at(-1))
						})
					}
				})
			})
		},
	},
})
