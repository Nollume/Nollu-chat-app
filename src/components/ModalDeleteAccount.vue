<template>
	<dialog ref="deleteModal" class="rounde-md relative">
		<div class="grid place-items-center">
			<h3 class="w-48 grid place-items-center text-gray-500 mb-2">
				Are you sure you want to delete the account?
			</h3>
			<div class="flex gap-2">
				<button
					@click="authStore.deleteUser"
					class="px-2 py-1 cursor-pointer text-red-500 underline rounded-md hover:text-red-400 active:text-red-400"
					:class="{
						'text-red-200 hover:text-red-100 active:text-red-100 cursor-no-drop':
							authStore.errorDeleteUser.length,
					}"
				>
					Accept
				</button>
				<button
					@click="closeModalDelete"
					class="px-2 text-gray-500 underline py-1 rounded-md hover:text-gray-400 active:text-gray-400"
				>
					Close
				</button>
			</div>

			<div
				v-if="authStore.errorDeleteUser.length"
				class="grid place-items-center text-gray-500 bg-white px-2 py-1 rounded-md relative after:-inset-0.5 after:bg-gradient-to-br after:from-teal-300 after:to-indigo-500 after:absolute after:rounded-md after:-z-50"
			>
				{{ authStore.errorDeleteUser }}
				<button
					@click="authStore.logOut"
					class="font-ubuntu px-2 relative bg-gradient-to-br from-teal-300 to-indigo-500 bg-clip-text text-transparent py-1 rounded-md hover:from-teal-200 hover:to-indigo-400 active:from-teal-200 active:to-indigo-400"
				>
					Re-login
				</button>
			</div>
		</div>
	</dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const deleteModal = ref(null)
const authStore = useAuthStore()

const emit = defineEmits(['openModalDelete'])

onMounted(() => {
	emit('openModalDelete', deleteModal.value)
})
const closeModalDelete = () => {
	deleteModal.value.close()
}
</script>

<style lang="scss" scoped></style>
