<template>
	<aside class="list absolute inset-0 bg z-30 bg-white overflow-scroll">
		<ModalNotifications @open-modal="modal = $event" />
		<div
			class="text-gray-500 shadow-md min-w-full bg-slate-100 flex flex-row-reverse items-center justify-start py-6 px-7 fixed rounded-b-3xl"
		>
			<div>
				<a href="#" class="icons" @click="store.redirectToHome">
					<CloseSvg />
				</a>
			</div>
			<h2 class="text-l text-gray-500 bold capitalize mx-auto pr-6">
				Notifications
			</h2>
			<router-link
				v-for="user in fireStore.getCurrentUser"
				:key="user.id"
				:to="{
					name: 'profile',
					params: { id: user.id },
				}"
				class="avatar overflow-hidden"
			>
				<div
					class="w-full aspect-square bg-cover bg-no-repeat"
					:style="{
						backgroundImage: ` url(${
							user.userPhoto
								? user.userPhoto
								: user.gender === 'male'
								? getImageUrl('avatar1.png')
								: getImageUrl('avatar2.png')
						})`,
					}"
				></div>
			</router-link>
		</div>

		<ul
			v-if="fireStore.numberOfRequest >= 1"
			class="min-h-screen pt-26 mx-6 z-40 flex flex-col gap-2"
		>
			<li
				v-for="user in fireStore.usersWhoAcceptRequest"
				:key="user.id"
				class="flex items-center gap-4 border-b-2 py-2"
			>
				<router-link
					:to="{ name: 'profile', params: { id: user.id } }"
					class="w-12 aspect-square bg-gradient-to-br from-teal-300 to-indigo-500 rounded-full overflow-hidden"
				>
					<div
						class="w-full aspect-square bg-cover bg-no-repeat"
						:style="{
							backgroundImage: ` url(${
								user.userPhoto
									? user.userPhoto
									: user.gender === 'male'
									? getImageUrl('avatar1.png')
									: getImageUrl('avatar2.png')
							})`,
						}"
					></div>
				</router-link>
				<div>
					<router-link
						:to="{ name: 'profile', params: { id: user.id } }"
						class="text-l text-gray-500 bold capitalize hover:text-gray-400 active:text-gray-400"
						>{{ user.userName }}</router-link
					>
					<p class="text-gray-400 text-sm">Accept your friend request</p>
				</div>
				<div class="ml-auto flex flex-col items-center gap-1 text-sm">
					<button
						@click="fireStore.deleteNotification(user.id)"
						class="flex items-center gap-1 px-2 text-nollu-100 py-1 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white hover:from-teal-200 hover:to-indigo-400 active:from-teal-200 active:to-indigo-400"
					>
						Ok
					</button>
				</div>
			</li>
			<li
				v-for="user in fireStore.receiverUsers"
				:key="user.id"
				class="flex items-center gap-4 border-b-2 py-2"
			>
				<router-link
					:to="{ name: 'profile', params: { id: user.id } }"
					class="w-12 aspect-square bg-gradient-to-br from-teal-300 to-indigo-500 rounded-full overflow-hidden"
				>
					<div
						class="w-full aspect-square bg-cover bg-no-repeat"
						:style="{
							backgroundImage: ` url(${
								user.userPhoto
									? user.userPhoto
									: user.gender === 'male'
									? getImageUrl('avatar1.png')
									: getImageUrl('avatar2.png')
							})`,
						}"
					></div>
				</router-link>
				<div>
					<router-link
						:to="{ name: 'profile', params: { id: user.id } }"
						class="text-l text-gray-500 bold capitalize hover:text-gray-400 active:text-gray-400"
						>{{ user.userName }}</router-link
					>
					<p class="text-gray-400 text-sm">Sent you a friend request</p>
				</div>
				<div class="ml-auto flex flex-col items-center gap-1 text-sm">
					<button
						@click="fireStore.addFriend(user.id)"
						class="flex items-center max-h-8 gap-1 px-2 text-nollu-100 py-1 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white hover:from-teal-200 hover:to-indigo-400 active:from-teal-200 active:to-indigo-400"
					>
						<CorrectSvg class="w-5 h-5" /> Accept
					</button>
					<button
						@click="fireStore.declineFriendRequest(user.id)"
						class="flex items-center gap-1 max-h-8 px-2 py-1 text-red-500 underline rounded-md hover:text-red-400 active:text-red-400"
					>
						<IncorrectSvg class="w-5 h-5" /> Decline
					</button>
				</div>
			</li>
		</ul>
		<div
			v-else-if="fireStore.receiverUsers.length === 0"
			class="text-gray-500 pt-28 text-xl grid place-items-center"
		>
			<p>No new notifications</p>
		</div>
	</aside>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCounterStore } from '../stores/counter'
import CloseSvg from '../components/icons/CloseSvg.vue'
import ModalNotifications from '../components/ModalNotifications.vue'
import { useFirestore } from '../stores/firestore'
import CorrectSvg from '../components/icons/CorrectSvg.vue'
import IncorrectSvg from '../components/icons/IncorrectSvg.vue'

const fireStore = useFirestore()

const store = useCounterStore()
const getImageUrl = (name) => {
	return new URL(`../assets/images/${name}`, import.meta.url).href
}

onMounted(() => {
	fireStore.findUsersWhoSentNotification()
})
</script>
