<template>
	<HeaderApp @searchUser="searchInputValue = $event" />
	<main class="min-h-screen -z-10 pt-32 pb-26">
		<ContactList :searchUser="searchInputValue" />
	</main>
	<FooterApp />
</template>

<script setup>
import ContactList from '@/components/Contacts/ContactList.vue'
import HeaderApp from '../components/HeaderApp.vue'
import FooterApp from '../components/FooterApp.vue'
import { onMounted, ref } from 'vue'
import { useFirestore } from '../stores/firestore'

const searchInputValue = ref('')
const fireStore = useFirestore()

onMounted(() => {
	fireStore.getSenderNotifications()
})
</script>
