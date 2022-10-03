<template>
	<div
		class="flex flex-row items-center gap-4 pt-28 pb-4 bg-white rounded-b-3xl"
	>
		<div v-if="fireStore.users.length" class="w-full">
			<ul class="list flex items-center gap-2 overflow-x-auto pr-6 py-1 pl-7">
				<li
					v-for="friend in fireStore.getCurrentUserFriends"
					:key="friend.id"
					class="relative"
					:class="{
						'after:absolute after:w-2.5 after:h-2.5 after:bg-lime-500 after:bottom-0.5 after:right-0 after:outline after:outline-2 after:outline-white after:rounded-full':
							friend.online === 'online',
					}"
				>
					<router-link
						:to="{
							name: 'person',
							params: { id: authStore.user.uid, uId: friend.uId },
						}"
						@click="fireStore.createMessageDoc(friend.uId, friend.userName)"
					>
						<p class="text-xs text-center" :title="friend.userName">
							{{
								truncate(friend.userName, {
									length: 7,
								})
							}}
						</p>
						<div class="avatar overflow-hidden">
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
					</router-link>
				</li>
			</ul>
			<p
				v-if="!fireStore?.getCurrentUserFriends?.length"
				class="text-gray-500 flex items-center justify-center"
			>
				Search for friends by username.
			</p>
		</div>
		<div
			v-else
			class="w-full text-gray-500 flex items.center justify-center scale-75"
		>
			<img src="/images/1496.gif" alt="loading" />
		</div>
	</div>
</template>

<script setup>
import truncate from 'lodash.truncate'
import { useFirestore } from '../../stores/firestore.js'
import { useAuthStore } from '../../stores/auth'

const fireStore = useFirestore()
const authStore = useAuthStore()

const getImageUrl = (name) => {
	return new URL(`../../assets/images/${name}`, import.meta.url).href
}
</script>

<style lang="scss" scoped></style>
