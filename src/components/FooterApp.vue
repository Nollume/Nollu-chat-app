<template>
	<footer class="bg-white rounded-t-3xl w-full py-4 fixed bottom-0 z-10">
		<div id="nav" class="flex items-center justify-evenly">
			<router-link
				to="/"
				:numberOfNewMessages="fireStore.numberOfNewMessages"
				class="links text-gray-400 flex items-center justify-center w-14 aspect-square rounded-full transition-all duration-200 ease-in-out relative"
				:class="{
					'notification-after after:top-1 after:content-[attr(numberOfNewMessages)] ':
						fireStore.numberOfNewMessages >= 1,
				}"
			>
				<ChatSvg />
			</router-link>
			<router-link
				to="/contact"
				class="links text-gray-400 flex items-center justify-center w-14 aspect-square rounded-full transition-all duration-200 ease-in-out"
			>
				<ContactSvg />
			</router-link>
		</div>
	</footer>
</template>

<script setup>
import ChatSvg from './icons/ChatSvg.vue'
import ContactSvg from './icons/ContactSvg.vue'
import { useFirestore } from '../stores/firestore'

const fireStore = useFirestore()
</script>
