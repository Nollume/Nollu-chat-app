<template>
	<div
		v-if="fireStore.messages.length"
		class="min-h-screen bg-white mb-14 px-6 flex flex-col gap-4 scroll-smooth"
	>
		<transition-group
			tag="ul"
			name="fade"
			class="min-w-full flex flex-col gap-4 pt-24"
		>
			<li
				v-for="msg in fireStore.messages"
				:key="msg.id"
				class="min-w-full flex flex-col"
				:class="msg.senderUser === id ? ' items-end' : ' items-start'"
			>
				<p
					class="max-w-[80%] py-4 px-8 bold rounded-t-3xl"
					:class="
						msg.senderUser === id
							? 'text-nollu-100 bg-gradient-to-br from-teal-300 to-indigo-500 rounded-l-3xl'
							: 'text-gray-500  bg-slate-100 rounded-r-3xl'
					"
				>
					{{ msg.message }}
				</p>
				<time
					class="text-gray-400 text-sm"
					:datetime="msg?.createdAt?.toDate()"
					>{{ store.dateAgo(msg.createdAt) }}</time
				>
			</li>
		</transition-group>
		<div ref="bottom"></div>
	</div>
	<div v-else class="pt-24 text-gray-500 w-full grid place-items-center">
		Send a message...
	</div>
</template>

<script setup>
import { onUnmounted, ref, watchEffect } from 'vue'
import { useCounterStore } from '../../stores/counter'
import { useFirestore } from '../../stores/firestore'

const fireStore = useFirestore()
const store = useCounterStore()

const props = defineProps({
	// currentUser uid
	id: {
		type: String,
	},
	uId: {
		type: String,
	},
})

const bottom = ref(null)

watchEffect(() => {
	if (fireStore.messages.length > 3) {
		bottom.value?.scrollIntoView({ behavior: 'smooth' })
	}
})

onUnmounted(() => {
	fireStore.clearMessages()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: all 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
	transform: scale(0.8);
	opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
	transform: scale(1);
	opacity: 1;
}
</style>
