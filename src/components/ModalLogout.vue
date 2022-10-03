<template>
	<dialog ref="modal" class="rounde-md relative">
		<div class="grid place-items-center">
			<h3 class="grid place-items-center text-gray-500 mb-2">
				Are you sure you want to log out?
			</h3>
			<div class="flex gap-2">
				<button
					class="px-2 text-nollu-100 py-1 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white"
					@click="authStore.logOut"
				>
					Accept
				</button>
				<button
					@click="closeModal"
					class="px-2 text-gray-500 underline py-1 rounded-md hover:text-gray-400 active:text-gray-400"
				>
					Close
				</button>
			</div>
		</div>
	</dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const modal = ref(null)

const emit = defineEmits(['openModal'])

onMounted(() => {
	emit('openModal', modal.value)
})
const closeModal = () => {
	modal.value.close()
}
</script>
