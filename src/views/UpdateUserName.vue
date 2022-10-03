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
			Change username
		</h2>
		<form
			@submit.prevent="
				authStore.updateUserName(store.validateUserName(userName))
			"
			class="w-full flex flex-col items-center gap-1"
		>
			<input
				ref="input"
				type="text"
				name="name"
				placeholder="Username"
				required
				@keyup="
					authStore.userNameAlreadyExist(store.validateUserName(userName))
				"
				v-model="userName"
				class="w-full py-1 pl-3 pr-8 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner outline-none focus:bg-white transition-all duration-300 ease-in-out"
			/>
			<p class="text-xs" v-if="authStore.nameExist">
				{{ authStore.errNameExist }}
			</p>
			<p class="text-xs" v-if="authStore.errChangeName.length">
				{{ authStore.errChangeName }}
			</p>
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

const userName = ref('')
const input = ref(null)

onMounted(() => {
	input.value.focus()
})
</script>

<style lang="scss" scoped></style>
