<template>
	<div
		class="min-h-screen relative py-8 px-20 flex flex-col gap-1 items-center justify-center bg-gradient-to-br from-teal-300 to-indigo-500"
	>
		<CloseSvg
			@click="store.redirectToBack"
			class="text-white absolute top-8 right-8 transform scale-125 cursor-pointer"
		/>
		<h2
			class="m-0 text-2xl font-bold text-nollu-100 select-none whitespace-nowrap capitalize"
		>
			forgotten password
		</h2>

		<form
			v-if="!authStore.messageAfterRessetEmail.length"
			ref="form"
			@submit.prevent="authStore.sendAPasswordResetEmail(email, form)"
			class="w-full flex flex-col items-center gap-1"
		>
			<input
				ref="input"
				type="email"
				name="name"
				placeholder="Email address"
				required
				v-model="email"
				class="w-full py-1 pl-3 pr-8 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-none focus:bg-white transition-all duration-300 ease-in-out"
			/>
			<p class="text-xs whitespace-nowrap text-nollu-100">
				Enter your email and then check email.
			</p>

			<button class="underline text-nollu-100 hover:text-white active:white">
				Confirm
			</button>
		</form>
		<div v-else class="text-nollu-100 whitespace-nowrap">
			{{ authStore.messageAfterRessetEmail }}
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCounterStore } from '../stores/counter'
import CloseSvg from '../components/icons/CloseSvg.vue'
import { Input } from 'postcss'

const authStore = useAuthStore()
const store = useCounterStore()

const email = ref('')
const input = ref(null)
const form = ref(null)

onMounted(() => {
	input.value.focus()
})
</script>

<style lang="scss" scoped></style>
