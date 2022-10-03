<template>
	<div class="w-full">
		<ul class="w-full flex flex-col gap-2">
			<li v-for="friend in sliceFriends" :key="friend.id">
				<router-link
					@click="pushToHref"
					:to="{ name: 'profile', params: { id: friend.id } }"
					class="flex items-center gap-4 cursor-pointer rounded-2xl hover:bg-gray-200 active:bg-gray-200 transition duration-300 ease-in-out"
				>
					<div class="w-8 aspect-square relative">
						<div class="avatar w-8 overflow-hidden">
							<div
								class="w-full aspect-square bg-cover bg-no-repeat"
								:style="{
									backgroundImage: ` url(${
										friend.userPhoto
											? friend.userPhoto
											: friend.gender === 'male'
											? getImageUrl('avatar1.png')
											: getImageUrl('avatar2.png')
									})`,
								}"
							></div>
						</div>
					</div>
					<h3 class="text-gray-500 text-l bold capitalize">
						{{ friend.userName }}
					</h3>
				</router-link>
			</li>
		</ul>
		<div
			class="flex text-gray-500 flex-col items-center mx-5 mt-2 cursor-pointer hover:text-gray-400 active:text-gray-400 transition-all duration-200 ease-in-out"
			v-if="fireStore.userFriendsInProfile.length > 5"
			@click="moreFriends"
		>
			<ArrowSvg class="-rotate-90 text-center" />
			<div
				v-if="fireStore.userFriendsInProfile.length > 5"
				class="text-l capitalize"
			>
				Show more friends
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFirestore } from '../stores/firestore'
import ArrowSvg from '@/components/icons/ArrowSvg.vue'

const fireStore = useFirestore()

const currentPage = ref(5)

const sliceFriends = computed(() => {
	return fireStore.userFriendsInProfile.slice(0, currentPage.value)
})

const moreFriends = () => {
	if (currentPage.value <= fireStore.userFriendsInProfile.length) {
		currentPage.value += 5
	}
}

const getImageUrl = (name) => {
	return new URL(`../assets/images/${name}`, import.meta.url).href
}

const pushToHref = () => {
	setTimeout(() => {
		window.location.reload()
	}, 100)
}
</script>

<style lang="scss" scoped></style>
