<template>
	<div
		class="min-h-screen relative py-8 px-20 flex flex-col gap-1 items-center justify-center bg-gradient-to-br from-teal-300 to-indigo-500"
	>
		<CloseSvg
			@click="store.redirectToBack"
			class="text-white absolute top-8 right-8 transform scale-125 cursor-pointer"
		/>
		<h2
			class="m-0 text-2xl font-bold text-nollu-100 select-none whitespace-nowrap"
		>
			Change email address
		</h2>
		<form
			@submit.prevent="authStore.updateEmailAddress(email)"
			class="w-full flex flex-col items-center gap-1"
		>
			<input
				ref="input"
				type="email"
				name="name"
				placeholder="Email address"
				required
				@keyup="authStore.emailAlreadyExist(email)"
				v-model="email"
				class="w-full py-1 pl-3 pr-8 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-none focus:bg-white transition-all duration-300 ease-in-out"
			/>

			<div class="text-xs" v-if="authStore.errChangeEmail.length">
				{{ authStore.errChangeEmail }}
				<div
					v-if="authStore.errChangeEmail === 'Requires recent login'"
					class="grid place-items-center text-gray-500 bg-white px-2 py-1 rounded-md relative after:-inset-0.5 after:bg-gradient-to-br after:from-teal-300 after:to-indigo-500 after:absolute after:rounded-md after:-z-50"
				>
					<button
						@click="authStore.logOut"
						class="font-ubuntu px-2 relative bg-gradient-to-br from-teal-300 to-indigo-500 bg-clip-text text-transparent py-1 rounded-md hover:from-teal-200 hover:to-indigo-400 active:from-teal-200 active:to-indigo-400"
					>
						Re-login
					</button>
				</div>
			</div>
			<button class="underline text-nollu-100 hover:text-white active:white">
				Confirm
			</button>
		</form>
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

onMounted(() => {
	input.value.focus()
})
</script>

<style lang="scss" scoped></style>
