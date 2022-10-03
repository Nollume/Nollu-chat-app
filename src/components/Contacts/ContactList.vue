<template>
	<div v-if="fireStore.users.length">
		<ul class="flex flex-col gap-3 mt-4 mx-6">
			<li
				v-if="!fireStore.getCurrentUserFriends.length"
				class="text-gray-500 flex items-center justify-center"
			>
				Search for friends by username.
			</li>
			<li v-else-if="fireStore.getCurrentUserFriends.length === 1">
				<h3 class="text-gray-500">Friend</h3>
			</li>
			<li v-else>
				<h3 class="text-gray-500">Friends</h3>
			</li>
			<li v-for="friend in fireStore.getCurrentUserFriends" :key="friend.id">
				<router-link
					:to="{ name: 'profile', params: { id: friend.id } }"
					class="flex items-center gap-4 cursor-pointer rounded-2xl hover:bg-gray-200 active:bg-gray-200 transition duration-300 ease-in-out"
				>
					<div
						class="w-8 aspect-square relative"
						:class="{
							' after:absolute after:w-2 after:h-2 after:bg-lime-500 after:bottom-0.5 after:right-0 after:outline after:outline-2 after:outline-slate-100 after:rounded-full':
								friend.online === 'online',
						}"
					>
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
	</div>
	<div v-else class="text-gray-500 pt-14 text-2xl grid place-items-center">
		<img src="/images/1496.gif" alt="loading" />
	</div>
</template>

<script setup>
import { useFirestore } from '../../stores/firestore'

const fireStore = useFirestore()

const getImageUrl = (name) => {
	return new URL(`../../assets/images/${name}`, import.meta.url).href
}
</script>
