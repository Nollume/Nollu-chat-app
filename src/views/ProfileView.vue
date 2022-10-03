<template>
	<main class="min-h-screen bg-slate-100 z-20 relative inset-0">
		<ProfileHeader class="z-40" />

		<section v-if="fireStore.userDoc.length">
			<main
				v-for="user in fireStore.userDoc"
				:key="user.id"
				class="pt-24 pb-8 min-h-screen px-6 flex flex-col items-start gap-4"
			>
				<ProfileImage
					:user="user"
					:modal="modalImage"
					@send-Url-image="url = $event"
				/>
				<div
					class="relative w-full flex items-center justify-center py-1 px-2 rounded-md"
				>
					<p
						class="capitalize text-gray-500 absolute left-2 flex items-center gap-1"
					>
						<FriendSvg /> friends: {{ user.friends?.length }}
					</p>
					<p
						class="text-xl font-ubuntu whitespace-nowrap bg-gradient-to-br from-teal-300 to-indigo-500 bg-clip-text text-transparent"
					>
						{{ user.userName }}
					</p>
					<EditSvg
						v-if="fireStore.currentUser"
						class="text-gray-500 cursor-pointer absolute right-2 hover:scale-105 active:scale-105 transition-all duration-200 ease-in-out"
						@click="store.redirectToUpdateUserName"
					/>
				</div>
				<div class="w-full flex flex-col items-start gap-4">
					<ProfileActive
						:user="user"
						@showFriends="showFriends = $event"
						:toggleUnfriend="toggleUnfriend"
						:id="props.id"
					/>
					<router-view />
					<ProfileInfo v-if="!showFriends" :user="user" />
				</div>

				<ProfileLogOutDelete
					v-if="!showFriends"
					:openModal="openModal"
					:openDeleteUserModal="openDeleteUserModal"
				/>
			</main>
		</section>
		<aside v-else class="text-gray-500 pt-28 text-2xl grid place-items-center">
			<img src="/images/1496.gif" alt="loading" />
		</aside>
		<ModalNotifications @openModal="notificationsModal = $event" />
		<ModalLogout @openModal="modal = $event"> </ModalLogout>
		<ModalDeleteAccount @open-modal-delete="deleteUserModal = $event" />
		<ModalImage @openModal="modalImage = $event" :user="url" />
	</main>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ProfileHeader from '../components/Profile/ProfileHeader.vue'
import { useCounterStore } from '../stores/counter'
import { useFirestore } from '../stores/firestore'
import EditSvg from '../components/icons/editSvg.vue'
import FriendSvg from '@/components/icons/FriendSvg.vue'
import ModalLogout from '../components/ModalLogout.vue'
import ModalDeleteAccount from '../components/ModalDeleteAccount.vue'
import ModalImage from '../components/ModalImage.vue'
import ModalNotifications from '../components/ModalNotifications.vue'
import ProfileImage from '../components/Profile/ProfileImage.vue'
import ProfileActive from '../components/Profile/ProfileActive.vue'
import ProfileLogOutDelete from '../components/Profile/ProfileLogOutDelete.vue'
import ProfileInfo from '../components/Profile/ProfileInfo.vue'

const store = useCounterStore()
const fireStore = useFirestore()

const props = defineProps({
	id: {
		type: String,
	},
})
const toggleUnfriend = ref(false)

const modal = ref(null)
const deleteUserModal = ref(null)
const notificationsModal = ref(null)
const showFriends = ref(false)
const modalImage = ref(null)
const url = ref(null)

const openModal = () => {
	modal.value.showModal()
}

const openDeleteUserModal = () => {
	deleteUserModal.value.showModal()
}

onMounted(() => {
	fireStore.getUser(props.id)
	fireStore.ifCurrentUserProfile(props.id)
	fireStore.getSenderNotifications(props.id)
	fireStore.ifFriend(props.id)
	fireStore.getUserFriends(props.id)

	document.addEventListener('click', (e) => {
		if (e.target.matches('.friends-button')) {
			toggleUnfriend.value = !toggleUnfriend.value
		} else toggleUnfriend.value = false
	})
})

onUnmounted(() => {
	fireStore.clearUserArray()
})
</script>
