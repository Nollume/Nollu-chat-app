<template>
	<div v-if="authStore?.user">
		<div v-if="authStore?.user?.emailVerified">
			<HeaderApp v-if="authStore.isLogin" />
			<main class="min-h-screen -z-10" v-if="authStore.isLogin">
				<home-horizontal-scroll />
				<ul class="flex flex-col gap-4 mt-2 mx-6 pb-26">
					<li v-for="friend in fireStore.usersWithMessage" :key="friend.id">
						<router-link
							:to="{
								name: 'person',
								params: { id: authStore.user.uid, uId: friend.uId },
							}"
							class="flex items-center gap-4 cursor-pointer rounded-full hover:bg-gray-200 active:bg-gray-200 transition duration-300 ease-in-out"
						>
							<home-chat
								:userName="friend.userName"
								:online="friend.online"
								:userPhoto="friend.userPhoto"
								:gender="friend.gender"
								:friendUid="friend.uId"
								:currentUser="authStore.user.uid"
							/>
						</router-link>
					</li>
				</ul>
			</main>
			<FooterApp v-if="authStore.isLogin" />
		</div>
		<div v-else class="min-h-screen grid place-items-center relative">
			<div class="absolute top-6 right-4 flex flex-col gap-2">
				<button
					@click="authStore.logOut"
					class="text-xs bg-gradient-to-br from-teal-300 to-indigo-500 py-1 px-2 rounded-md text-nollu-100 font-ubuntu hover-button"
				>
					Log out
				</button>
				<button
					@click="authStore.deleteUser"
					class="text-xs py-1 px-2 rounded-md text-gray-500 bg-gray-300 font-ubuntu hover-button hover:bg-gray-200 active:bg-gray-200"
				>
					Delete Account
				</button>
			</div>
			<div class="text-center">
				<p class="text-xl pb-4">Verify your email to continue.</p>
				<p class="text-xs">If you can't find the email, try to check spam.</p>

				<button
					@click="store.reload"
					class="mt-auto flex items-center justify-center gap-4 bg-gradient-to-br from-teal-300 to-indigo-500 py-1 px-2 rounded-md text-nollu-100 font-ubuntu"
				>
					After confirming the email, click here
				</button>
				<p>{{ authStore?.user?.email }}</p>
			</div>
		</div>
	</div>
	<div v-else class="text-gray-500 pt-14 text-2xl grid place-items-center">
		<img src="/images/1496.gif" alt="loading" />
	</div>
</template>

<script setup>
import HeaderApp from '../components/HeaderApp.vue'
import FooterApp from '../components/FooterApp.vue'
import HomeHorizontalScroll from '../components/HomeChat/HomeHorizontalScroll.vue'
import HomeChat from '../components/HomeChat/HomeChat.vue'
import { useFirestore } from '../stores/firestore'
import { useAuthStore } from '../stores/auth'
import { useCounterStore } from '../stores/counter'
import { onMounted, watchEffect } from 'vue'

const fireStore = useFirestore()
const authStore = useAuthStore()
const store = useCounterStore()

watchEffect(() => {
	if (authStore.isLogin) {
		fireStore.getAllUsersWithMessages()
	}
})

onMounted(() => {
	fireStore.getSenderNotifications()
})
</script>
