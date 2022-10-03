<template>
	<dialog ref="modal" class="rounde-md relative">
		<div class="grid place-items-center">
			<h3 class="grid place-items-center text-gray-500 mb-2">
				Accept friend request?
			</h3>
			<div class="flex gap-2">
				<button
					class="px-2 text-nollu-100 py-1 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-md hover:text-white active:text-white"
				>
					Accept
				</button>
				<button
					class="px-2 py-1 text-red-500 underline rounded-md hover:text-red-400 active:text-red-400"
				>
					Decline
				</button>
			</div>
			<a
				href="#"
				class="absolute top-1 right-1 text-gray-400 rounded-full transition-all duration-200 ease-in-out scale-75 hover:scale-90 active:scale-90"
				@click="closeModal"
			>
				<CloseSvg />
			</a>
		</div>
	</dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CloseSvg from './icons/CloseSvg.vue'

const modal = ref(null)

const emit = defineEmits(['openModal'])

onMounted(() => {
	emit('openModal', modal.value)
})
const closeModal = () => {
	modal.value.close()
}
</script>

<style lang="scss" scoped></style>
