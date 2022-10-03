<template>
	<div v-cloak class="min-h-screen relative overflow-hidden bg-slate-100">
		<router-view />
	</div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useAuthStore } from './stores/auth'
import { useFirestore } from './stores/firestore'

const authStore = useAuthStore()
const firestore = useFirestore()
onBeforeMount(() => {
	authStore.authStateChanged()

	firestore.getUsers()
})
</script>

<style scoped>
[v-cloak] {
	display: none;
}
.router-link-active {
	user-select: none;
}
</style>
