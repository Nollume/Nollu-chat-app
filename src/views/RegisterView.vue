<template>
	<div
		class="min-h-screen py-8 px-20 flex flex-col items-center justify-between bg-gradient-to-br from-teal-300 to-indigo-500"
	>
		<h1 class="m-0 text-4xl font-bold text-nollu-100 select-none">Nollu</h1>
		<div class="w-full flex flex-col gap-2 items-center">
			<h2 class="m-0 text-2xl font-bold text-nollu-100 select-none">
				Register
			</h2>
			<form
				@submit.prevent="
					authStore.registerNewUser(
						userEmail,
						userPassword,
						userConfirmPassword,
						store.validateUserName(userName),
						gender,
						dateOfBirth
					)
				"
				class="w-full flex flex-col items-center gap-1 text-sm"
			>
				<input
					type="text"
					name="name"
					@keyup="
						authStore.userNameAlreadyExist(store.validateUserName(userName))
					"
					placeholder="Username"
					required
					v-model="userName"
					:class="{
						'border-2 border-solid border-red-500 focus:border-red-500':
							authStore.nameExist,
					}"
					class="w-full py-1 px-3 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-none focus:bg-white transition-all duration-300 ease-in-out"
				/>

				<input
					class="w-full py-1 px-3 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-none focus:bg-white transition-all duration-300 ease-in-out"
					type="email"
					:class="{
						'border-2 border-solid border-red-500 focus:border-red-500':
							!authStore.emailValid,
						'border-2 border-solid border-red-500 focus:border-red-500':
							authStore.errMessage === 'The entered email is already in use',
					}"
					name="email"
					@keyup="validateEmail"
					v-model="userEmail"
					required
					placeholder="Email"
				/>
				<label for="gender" class="w-full px-2 text-nollu-100">Gender:</label>
				<select
					class="w-full py-1 px-3 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-none focus:bg-white transition-all duration-300 ease-in-out"
					name="gender"
					id="gender"
					v-model="gender"
				>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</select>
				<label for="birthday" class="w-full px-2 text-nollu-100"
					>Date of birth:</label
				>
				<input
					type="date"
					v-model="dateOfBirth"
					required
					class="w-full py-1 px-3 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-none focus:bg-white transition-all duration-300 ease-in-out"
				/>

				<label class="w-full relative">
					<CorrectSvg
						v-if="conditionApplies"
						class="absolute top-1/2 -translate-y-1/2 text-green-500 right-0"
					/>
					<IncorrectSvg
						v-if="moreCharacters"
						class="absolute top-1/2 -translate-y-1/2 text-red-500 right-0"
					/>
					<input
						class="w-full py-1 px-3 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-none focus:bg-white transition-all duration-300 ease-in-out"
						type="password"
						name="password"
						:class="{
							'border-2 border-solid border-green-500 focus:border-green-500':
								conditionApplies,
							'border-2 border-solid border-red-500 focus:border-red-500':
								moreCharacters,
						}"
						v-model="userPassword"
						@keyup="passwordDoMatch"
						required
						placeholder="Password"
					/>
				</label>
				<label class="w-full relative">
					<CorrectSvg
						v-if="conditionApplies"
						class="absolute top-1/2 -translate-y-1/2 text-green-500 right-0"
					/>
					<IncorrectSvg
						v-if="moreCharacters"
						class="absolute top-1/2 -translate-y-1/2 text-red-500 right-0"
					/>
					<input
						class="w-full py-1 px-3 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-none focus:bg-white transition-all duration-300 ease-in-out"
						type="password"
						name="confirm-password"
						:class="{
							'border-2 border-solid border-green-500 focus:border-green-500':
								conditionApplies,
							'border-2 border-solid border-red-500 focus:border-red-500':
								moreCharacters,
						}"
						v-model="userConfirmPassword"
						@keyup="passwordDoMatch"
						required
						placeholder="Confirm password"
					/>
				</label>
				<div class="w-full px-2 flex flex-col items-start justify-start">
					<p class="text-xs" v-if="authStore.nameExist">
						{{ authStore.errNameExist }}
					</p>
					<p v-if="!authStore.emailValid" class="text-xs">invalid email</p>
					<p class="text-xs" v-if="!passwordMatch">Passwords do not match</p>

					<p class="text-xs" v-if="authStore.errMessage.length">
						{{ authStore.errMessage }}
					</p>
				</div>
				<button class="text-sm underline text-nollu-100 whitespace-nowrap">
					Create Account
				</button>
			</form>
		</div>

		<div class="w-full flex items-center justify-between gap-2 text-sm">
			<span class="whitespace-nowrap">Already have an account?</span>
			<button
				class="underline text-nollu-100 whitespace-nowrap"
				@click="store.redirectToLogin"
			>
				Sign in
			</button>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCounterStore } from '../stores/counter'
import { useAuthStore } from '../stores/auth'
import debounce from 'lodash.debounce'
import CorrectSvg from '../components/icons/CorrectSvg.vue'
import IncorrectSvg from '../components/icons/IncorrectSvg.vue'

const store = useCounterStore()
const authStore = useAuthStore()

const userName = ref('')
const userEmail = ref('')
const userPassword = ref('')
const userConfirmPassword = ref('')
const gender = ref('male')
const dateOfBirth = ref('')

const passwordMatch = ref(true)
const verification = ref(true)

const passwordDoMatch = debounce(() => {
	if (userPassword.value.length >= 1 && userConfirmPassword.value.length >= 1) {
		verification.value = false
		if (
			userPassword.value.length >= 6 &&
			userConfirmPassword.value.length >= 6
		) {
			verification.value = true
		}
		if (userPassword.value === userConfirmPassword.value)
			return (passwordMatch.value = true)
		else return (passwordMatch.value = false)
	} else {
		verification.value = true
		passwordMatch.value = true
	}
}, 250)

const conditionApplies = computed(() => {
	if (userPassword.value.length > 5 && userConfirmPassword.value.length > 5) {
		if (passwordMatch.value && verification.value) return true
	}
	return false
})

const moreCharacters = computed(() => {
	if (
		!conditionApplies.value &&
		userPassword.value.length >= 1 &&
		userConfirmPassword.value.length >= 1
	) {
		return true
	}
	return false
})

const validateEmail = debounce(() => {
	authStore.validateEmail(userEmail.value)
}, 350)
</script>

<style lang="scss" scoped></style>
