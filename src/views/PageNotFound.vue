<template>
	<div class="min-h-screen grid place-items-center">
		<div class="text-center text-gray-500">
			<h3 class="text-4xl">404</h3>
			<p>Page not found</p>
			<button
				@click="store.redirectToHome"
				class="mt-6 bg-gradient-to-br from-teal-300 to-indigo-500 text-nollu-100 rounded-md px-1 py-0.5 hover-button"
			>
				Back To Home
			</button>
		</div>
	</div>
</template>

<script setup>
import { useCounterStore } from '../stores/counter'
const store = useCounterStore()
</script>
