<template>
	<header
		class="before-header bg-white rounded-b-3xl w-full pt-4 pb-2 fixed z-10"
	>
		<div class="w-full mb-4 relative flex items-center justify-between">
			<div
				v-if="fireStore.users.length"
				class="w-full flex items-center justify-start"
			>
				<router-link
					v-for="user in fireStore.getCurrentUser"
					:key="user.id"
					:to="{
						name: 'profile',
						params: { id: user.id },
					}"
					class="avatar w-8 overflow-hidden ml-7 border-2 border-white"
				>
					<div
						class="w-full aspect-square bg-cover bg-no-repeat"
						:style="{
							backgroundImage: ` url(${
								user.userPhoto
									? user.userPhoto
									: user.gender === 'male'
									? getImageUrl('avatar1.png')
									: getImageUrl('avatar2.png')
							})`,
						}"
					></div>
				</router-link>
				<div class="ml-2">
					<h1 class="m-0 py-1 text-xs text-white">
						{{ authStore?.user?.displayName }}
					</h1>
				</div>
			</div>

			<div class="flex justify-center gap-2 items-center mr-7 ml-auto">
				<router-link
					to="/notifications"
					:numberOfNotifications="fireStore.numberOfRequest"
					class="icons relative"
					:class="{
						'notification-after after:content-[attr(numberOfNotifications)] ':
							fireStore.numberOfRequest >= 1,
					}"
					><NotificationsSvg
				/></router-link>
			</div>
		</div>
		<HeaderForm
			@searchUser="searchInputValue = $event"
			@focusInput="inputFocused = $event"
		/>
	</header>
</template>

<script setup>
import NotificationsSvg from './icons/NotificationsSvg.vue'
import HeaderForm from './HeaderForm.vue'
import { useFirestore } from '../stores/firestore'
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const fireStore = useFirestore()

const searchInputValue = ref('')
const inputFocused = ref(null)

const emit = defineEmits(['searchInputFocus', 'searchUser'])

watch(searchInputValue, () => {
	emit('searchUser', searchInputValue.value)
})

onMounted(() => {
	emit('searchInputFocus', inputFocused.value)
})

const getImageUrl = (name) => {
	return new URL(`../assets/images/${name}`, import.meta.url).href
}
</script>

<style lang="scss" scoped></style>
