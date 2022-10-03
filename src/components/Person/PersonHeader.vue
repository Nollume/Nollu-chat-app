<template>
	<div
		class="text-gray-500 shadow-md min-w-full bg-slate-100 flex items-center justify-between py-6 px-4 fixed rounded-b-3xl"
	>
		<div>
			<a href="#" class="icons">
				<BackSvg @click.prevent="store.redirectToHome" />
			</a>
		</div>
		<h2 class="text-l text-gray-500 bold capitalize">
			{{ userName }}
		</h2>

		<div class="relative">
			<button class="show-profile icons outline-none">
				<PersonInfoSvg class="show-profile" />
			</button>
			<router-link
				:to="{ name: 'profile', params: { id: id } }"
				v-if="toggleProfile"
				class="absolute px-3 py-1.5 bg-white shadow-md whitespace-nowrap right-1 -bottom-8 rounded-md cursor-pointer hover:text-gray-400 active:text-gray-400"
			>
				{{ userName }} profile
			</router-link>
		</div>
	</div>
</template>

<script setup>
import BackSvg from '../icons/BackSvg.vue'
import PersonInfoSvg from '../icons/PersonInfoSvg.vue'
import { useCounterStore } from '../../stores/counter'
import { onMounted, ref } from 'vue'

const store = useCounterStore()

const toggleProfile = ref(false)
const props = defineProps({
	userName: {
		type: String,
	},
	id: { type: String },
})

onMounted(() => {
	document.addEventListener('click', (e) => {
		if (e.target.matches('.show-profile')) {
			toggleProfile.value = !toggleProfile.value
		} else toggleProfile.value = false
	})
})
</script>

<style lang="scss" scoped></style>
