<template>
	<HeaderApp
		@searchUser="searchInputValue = $event"
		@searchInputFocus="inputFocus = $event"
	/>
	<div v-if="fireStore.users.length" class="min-h-screen -z-10 pt-28 pb-8">
		<ul v-if="searchInputValue.length" class="flex flex-col gap-3 mt-4 mx-6">
			<li v-for="user in allUsers" :key="user.id">
				<router-link
					:to="{ name: 'profile', params: { id: user.id } }"
					class="flex items-center gap-4 cursor-pointer rounded-2xl hover:bg-gray-200 active:bg-gray-200 transition duration-300 ease-in-out"
				>
					<div
						class="w-8 aspect-square relative"
						:class="{
							' after:absolute after:w-2 after:h-2 after:bg-lime-500 after:bottom-0.5 after:right-0 after:outline after:outline-2 after:outline-slate-100 after:rounded-full':
								isUserFriend(user.id) && user.online === 'online',
						}"
					>
						<div class="avatar w-8 overflow-hidden">
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
						</div>
					</div>
					<h3 class="text-gray-500 text-l bold capitalize">
						{{ user.userName }}
					</h3>
					<div v-if="isUserFriend(user.id)" class="text-gray-500 ml-auto">
						<FriendSvg />
					</div>
				</router-link>
			</li>
		</ul>
		<div v-else class="text-gray-500 pt-14 text-2xl grid place-items-center">
			Search by Username
		</div>
	</div>
	<div v-else class="text-gray-500 pt-14 text-2xl grid place-items-center">
		<img src="/images/1496.gif" alt="loading" />
	</div>
	<button
		class="flex items-center border-2 border-gray-500 justify-center w-12 h-12 absolute bottom-2 left-2 bg-white rounded-full z-30"
		@click="store.redirectToBack"
	>
		<ArrowSvg class="w-10 h-10" />
	</button>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useFirestore } from '../stores/firestore'
import { useCounterStore } from '../stores/counter'
import HeaderApp from '../components/HeaderApp.vue'
import FriendSvg from '../components/icons/FriendSvg.vue'
import ArrowSvg from '../components/icons/ArrowSvg.vue'

const store = useCounterStore()
const fireStore = useFirestore()
const inputFocus = ref(null)

const searchInputValue = ref('')

const allUsers = computed(() => {
	return fireStore.getUsersNotCurrentUser.filter((user) =>
		store.validateSearchUserName(user.userName).includes(searchInputValue.value)
	)
})

const isUserFriend = (userId) => {
	const ids = fireStore.getCurrentUserFriends.map((user) => {
		return user.id
	})

	return ids.some((id) => id === userId)
}

onMounted(() => {
	inputFocus.value.focus()
})
const getImageUrl = (name) => {
	return new URL(`../assets/images/${name}`, import.meta.url).href
}
</script>
