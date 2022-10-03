<template>
	<div
		@click="store.getAge(user.dateOfBirth)"
		class="w-full flex items-center justify-start gap-4 bg-gray-300 py-1 px-2 rounded-md"
	>
		<p class="text-gray-500 font-ubuntu">Age:</p>
		<p ref="email" class="text-gray-500 whitespace-nowrap">
			{{ store.getAge(user.dateOfBirth) }}
		</p>
	</div>
	<div
		class="w-full flex items-center justify-start gap-4 bg-gray-300 py-1 px-2 rounded-md"
	>
		<p class="text-gray-500 font-ubuntu">Gender:</p>
		<p ref="email" class="text-gray-500 whitespace-nowrap">
			{{ capitalize(user.gender) }}
		</p>
	</div>
	<div
		class="w-full flex items-center justify-start gap-4 bg-gray-300 py-1 px-2 rounded-md"
	>
		<p class="text-gray-500 font-ubuntu">Email:</p>
		<p ref="email" class="text-gray-500 whitespace-nowrap">
			{{ user.userEmail }}
		</p>
		<EditSvg
			v-if="fireStore.currentUser"
			@click="store.redirectToEmailAddress"
			class="text-gray-500 cursor-pointer ml-auto hover:scale-105 active:scale-105 transition-all duration-200 ease-in-out"
		/>
	</div>
	<div
		class="w-full flex items-center justify-start gap-4 bg-gray-300 py-1 px-2 rounded-md"
	>
		<p class="text-gray-500 font-ubuntu">Joined on:</p>
		<time class="text-gray-500 whitespace-nowrap" :datetime="user.createdAt">{{
			store.niceDate(user.createdAt)
		}}</time>
	</div>
</template>

<script setup>
import EditSvg from '../icons/editSvg.vue'
import capitalize from 'lodash.capitalize'
import { useCounterStore } from '../../stores/counter'
import { useFirestore } from '../../stores/firestore'

const store = useCounterStore()
const fireStore = useFirestore()

defineProps({
	user: { type: Object },
})
</script>

<style lang="scss" scoped></style>
