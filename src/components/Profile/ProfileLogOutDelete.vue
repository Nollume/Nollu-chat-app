<template>
	<div
		v-if="fireStore.currentUser"
		class="w-full mt-auto flex flex-col items-center justify-center gap-4"
	>
		<button
			@click="openModal"
			class="w-full mt-auto flex items-center justify-center gap-4 bg-gradient-to-br from-teal-300 to-indigo-500 py-1 px-2 rounded-md text-nollu-100 font-ubuntu hover-button"
		>
			Log out
		</button>
		<button
			@click="openDeleteUserModal"
			class="w-full flex items-center justify-center gap-4 bg-gray-300 py-1 px-2 rounded-md text-gray-500 font-ubuntu hover:bg-gray-200 hover:text-gray-400 active:bg-gray-200 active:text-gray-400"
		>
			Delete Account
		</button>
	</div>
</template>

<script setup>
import { useFirestore } from '../../stores/firestore'

const fireStore = useFirestore()

defineProps({
	openDeleteUserModal: { type: Function },
	openModal: { type: Function },
})
</script>

<style lang="scss" scoped></style>
