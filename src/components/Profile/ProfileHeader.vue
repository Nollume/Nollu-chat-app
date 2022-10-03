<template>
	<div
		class="text-gray-500 shadow-md min-w-full bg-slate-100 flex items-center justify-start py-6 px-4 fixed rounded-b-3xl"
	>
		<div>
			<a href="#" class="icons">
				<BackSvg @click="store.redirectToHome" />
			</a>
		</div>
		<h2 class="text-l text-gray-500 bold capitalize mx-auto pr-8">Profile</h2>
	</div>
</template>

<script setup>
import BackSvg from '../icons/BackSvg.vue'
import PersonInfoSvg from '../icons/PersonInfoSvg.vue'
import { useCounterStore } from '../../stores/counter'
const store = useCounterStore()
</script>

<style lang="scss" scoped></style>
