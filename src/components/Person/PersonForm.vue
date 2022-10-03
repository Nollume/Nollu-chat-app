<template>
	<div class="bg-white w-full pt-2 pb-4 fixed bottom-0 z-40">
		<form
			@submit.prevent="fireStore.writeMessages(uId, text, form)"
			@keyup.shift.enter="fireStore.writeMessages(uId, text, form)"
			class="mx-6"
			ref="form"
		>
			<label class="flex items-center gap-4 justify-between">
				<textarea
					v-model="text"
					class="w-full max-h-12 py-1 px-3 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner border-none outline-gray-500 focus:bg-white transition-all duration-300 ease-in-out resize-none"
					name="textarea"
					placeholder="Send message..."
					rows="1"
				></textarea>
				<button
					class="h-8 aspect-square rounded-lg bg-gradient-to-br from-teal-300 to-indigo-500 flex items-center justify-center text-nollu-100 hover-button"
				>
					<SendMessageSvg />
				</button>
			</label>
		</form>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import SendMessageSvg from '../icons/SendMessageSvg.vue'
import { useFirestore } from '../../stores/firestore'

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

const text = ref('')
const form = ref(null)
</script>

<style lang="scss" scoped></style>
