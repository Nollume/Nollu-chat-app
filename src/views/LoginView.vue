<template>
	<div
		class="min-h-screen py-8 px-20 flex flex-col items-center justify-between bg-gradient-to-br from-teal-300 to-indigo-500"
	>
		<h1 class="m-0 text-4xl font-bold text-nollu-100 select-none">Nollu</h1>
		<div class="w-full flex flex-col gap-2 items-center">
			<h2 class="m-0 text-2xl font-bold text-nollu-100 select-none">Login</h2>
			<form
				@submit.prevent="authStore.logIn(userEmail, userPassword)"
				class="w-full flex flex-col items-center gap-1 text-sm"
			>
				<input
					class="w-full py-1 px-3 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-gray-500 focus:bg-white transition-all duration-300 ease-in-out"
					type="email"
					:class="{
						'border-2 border-solid border-red-500 focus:border-red-500':
							authStore.errorLogin === 'User not found',
					}"
					v-model="userEmail"
					required
					name="email"
					placeholder="Email"
				/>
				<input
					class="w-full py-1 px-3 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-gray-500 focus:bg-white transition-all duration-300 ease-in-out"
					type="password"
					:class="{
						'border-2 border-solid border-red-500 focus:border-red-500':
							authStore.errorLogin === 'User not found',
						'border-2 border-solid border-red-500 focus:border-red-500':
							authStore.errorLogin === 'Wrong password',
					}"
					name="password"
					v-model="userPassword"
					required
					placeholder="Password"
				/>
				<div
					v-if="authStore.errorLogin.length"
					class="w-full px-2 flex flex-col items-start justify-start"
				>
					<p class="text-xs">
						{{ authStore.errorLogin }}
					</p>
				</div>
				<div class="w-full px-2 flex items-center justify-between text-sm">
					<button class="underline text-nollu-100 whitespace-nowrap">
						Sign in
					</button>
					<router-link
						:to="{ name: 'UpdatePassword' }"
						class="underline text-nollu-100 whitespace-nowrap"
						>Forgot password?</router-link
					>
				</div>
			</form>
		</div>

		<div class="w-full flex items-center justify-between gap-2 text-sm">
			<span class="whitespace-nowrap">Not registered?</span>

			<button
				class="underline text-nollu-100 whitespace-nowrap"
				@click="store.redirectToRegister"
			>
				Create an account!
			</button>
		</div>
	</div>
</template>

<script setup>
import { useCounterStore } from '../stores/counter'
import { useAuthStore } from '../stores/auth'
import { ref } from 'vue'

const store = useCounterStore()
const authStore = useAuthStore()

const userEmail = ref(null)
const userPassword = ref(null)
</script>

<style lang="scss" scoped></style>
