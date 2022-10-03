<template>
	<div class="w-full flex items-start justify-between gap-4 text-gray-500">
		<div class="self-center flex flex-col gap-2">
			<p
				v-if="fireStore.receiver"
				class="text-sm whitespace-nowrap text-gray-500"
			>
				Sent you a friend request:
			</p>
			<div v-if="fireStore.sendRequest">
				<p
					v-if="user.gender === 'male'"
					class="text-sm whitespace-nowrap text-gray-500"
				>
					You sent him a friend request:
				</p>
				<p v-else class="text-sm whitespace-nowrap text-gray-500">
					You sent her a friend request:
				</p>
			</div>
			<router-link
				v-if="!showFriend"
				@click="friends"
				:to="{ name: 'friends', params: { friends: 'friends' } }"
				class="flex py-1 px-2 rounded-md items-center gap-1 mr-auto hover:text-gray-400 active:text-gray-400 transition-all duration-200 ease-in-out cursor-pointer"
			>
				<p class="capitalize flex gap-1 items-center">
					Show friends <ArrowSvg class="-rotate-90" />
				</p>
			</router-link>
			<div
				v-else
				@click="redirectBack"
				class="text-gray-500 h-9 py-1 px-2 rounded-md min-h-full flex items-center gap-1 mr-auto hover:text-gray-400 active:text-gray-400 transition-all duration-200 ease-in-out cursor-pointer"
			>
				<p class="capitalize flex gap-1 items-center">
					Show Profile <ArrowSvg class="rotate-90" />
				</p>
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<form class="ml-auto">
				<input
					@change="storageStore.handleFileUpload($event)"
					type="file"
					class="w-0 h-0 opacity-0 overflow-hidden absolute -z-10"
					name="file"
					id="file"
					accept=".jpg,.jpeg,.png"
				/>
				<label
					v-if="fireStore.currentUser"
					class="flex items-center justify-start gap-1 text-l leading-6 px-2 text-nollu-100 py-1 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white cursor-pointer"
					for="file"
				>
					<PhotoSvg />
				</label>
			</form>
			<div v-if="fireStore.friend" class="relative">
				<button
					class="friends-button w-full px-2 text-nollu-100 py-1 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white"
				>
					Friends
				</button>
				<div
					v-if="toggleUnfriend"
					class="flex items-center justify-center absolute bg-white w-full h-10 -left-4 -bottom-10 rounded-md shadow-lg"
				>
					<button
						@click="fireStore.removeFriend(props.id)"
						class="w-full h-full text-red-500 hover:text-red-400 active:text-red-400"
					>
						Unfriend
					</button>
				</div>
			</div>
			<div v-else>
				<div v-if="!fireStore.currentUser">
					<div
						v-if="!fireStore.receiver"
						class="text-sm leading-6 text-nollu-100 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white cursor-pointer"
					>
						<button
							v-if="!fireStore.sendRequest"
							@click="fireStore.sendNotification(props.id)"
							class="w-full px-2 py-1 flex items-center justify-start gap-1"
						>
							<span class="flex items-center"> <FriendSvg /> + </span>
							<p>Add friend</p>
						</button>
						<button
							v-else
							@click="fireStore.cancelFriendRequest(props.id)"
							class="w-full px-2 py-1 flex items-center justify-start gap-1"
						>
							<span class="flex items-center"> <FriendSvg /> - </span>
							<p>Cancel request</p>
						</button>
					</div>
					<div
						v-else
						class="text-sm leading-6 text-nollu-100 rounded-md hover:text-white active:text-white cursor-pointer"
					>
						<button
							@click="fireStore.addFriend(props.id)"
							class="px-2 text-nollu-100 py-1 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white"
						>
							Accept
						</button>
						<button
							@click="fireStore.declineFriendRequest(props.id)"
							class="px-2 py-1 text-red-500 underline rounded-md hover:text-red-400 active:text-red-400"
						>
							Decline
						</button>
					</div>
				</div>
			</div>

			<router-link
				:to="{
					name: 'person',
					params: { id: authStore.user.uid, uId: user.uId },
				}"
				@click="fireStore.createMessageDoc(user.uId, user.userName)"
				v-if="!fireStore.currentUser && fireStore.friend"
				class="text-sm flex items-center justify-start gap-1 text-l leading-6 px-2 text-nollu-100 py-1 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white"
			>
				<EnvelopeSvg />
				<p class="whitespace-nowrap">Send message</p>
			</router-link>
		</div>
	</div>
</template>

<script setup>
import { useFirestore } from '../../stores/firestore'
import { useCounterStore } from '../../stores/counter'
import { useAuthStore } from '../../stores/auth'
import { useStorageStore } from '../../stores/storage'

import PhotoSvg from '../icons/PhotoSvg.vue'
import EnvelopeSvg from '../icons/EnvelopeSvg.vue'
import ArrowSvg from '@/components/icons/ArrowSvg.vue'
import FriendSvg from '@/components/icons/FriendSvg.vue'
import { ref } from 'vue'

const fireStore = useFirestore()
const store = useCounterStore()
const authStore = useAuthStore()
const storageStore = useStorageStore()

const emit = defineEmits(['showFriends'])
const props = defineProps({
	user: {
		type: Object,
	},
	toggleUnfriend: {
		type: Boolean,
	},
	id: {
		type: String,
	},
})
const showFriend = ref(false)

const redirectBack = () => {
	store.redirectToBack()
	showFriend.value = false
	emit('showFriends', showFriend.value)
}

const friends = () => {
	showFriend.value = true
	emit('showFriends', showFriend.value)
}
</script>

<style lang="scss" scoped></style>
