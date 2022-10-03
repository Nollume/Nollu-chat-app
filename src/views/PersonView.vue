<template>
	<main
		v-if="id === authStore?.user?.uid"
		class="min-h-screen bg-slate-100 z-20 relative inset-0 scroll-smooth"
	>
		<PersonHeader :userName="user?.userName" :id="user?.id" />
		<PersonMessage :id="id" :uId="uId" />
		<PersonForm :id="id" :uId="uId" />
	</main>
	<div
		v-else
		class="w-screen pt-5 flex flex-col items-center gap-2 justify-center text-gray-500"
	>
		You do not have access!
		<button
			class="px-2 text-nollu-100 py-1 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white"
			@click="store.redirectToHome"
		>
			Home
		</button>
	</div>
</template>

<script setup>
import { onMounted, computed, onUnmounted } from 'vue'
import PersonForm from '../components/Person/PersonForm.vue'
import PersonHeader from '../components/Person/PersonHeader.vue'
import PersonMessage from '../components/Person/PersonMessage.vue'
import { useCounterStore } from '../stores/counter'
import { useFirestore } from '../stores/firestore'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const fireStore = useFirestore()

const props = defineProps({
	// currentUser uid
	id: {
		type: String,
	},
	uId: {
		type: String,
	},
})

const user = computed(() => {
	return fireStore.users.find((user) => user.uId === props.uId)
})

const store = useCounterStore()

onMounted(() => {
	fireStore.getMessages(props.id, props.uId)
})
onUnmounted(() => {
	fireStore.clearRoomMessage()
})
</script>

<style lang="scss" scoped></style>
