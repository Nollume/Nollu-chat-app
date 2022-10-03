<template>
	<div
		class="w-12 relative"
		:class="{
			'after:absolute after:w-3 after:h-3 after:bg-lime-500 after:bottom-0.5 after:right-0 after:outline after:outline-2 after:outline-slate-100 after:rounded-full':
				online === 'online',
		}"
	>
		<div
			class="w-12 aspect-square bg-gradient-to-br from-teal-300 to-indigo-500 rounded-full overflow-hidden"
		>
			<div
				class="w-full aspect-square bg-cover bg-no-repeat"
				:style="{
					backgroundImage: ` url(${
						userPhoto
							? userPhoto
							: gender === 'male'
							? getImageUrl('avatar1.png')
							: getImageUrl('avatar2.png')
					})`,
				}"
			></div>
		</div>
	</div>
	<div
		@click="
			fireStore.toggleIfRead(
				currentUser,
				friendUid,
				commonLastMessage.at(-1)?.senderUser
			)
		"
		class="w-full flex"
	>
		<div class="flex flex-col">
			<h3 class="text-l text-gray-500 bold capitalize">{{ userName }}</h3>
			<p
				class="leading-4 text-gray-400"
				:class="
					!messageNotRead.at(-1)?.read &&
					commonLastMessage.at(-1)?.senderUser !== currentUser
						? ' font-bold'
						: 'font-normal'
				"
			>
				<span v-if="commonLastMessage.at(-1)?.senderUser === currentUser">
					You:
				</span>
				{{
					truncate(commonLastMessage.at(-1)?.message, {
						length: 25,
					})
				}}
			</p>
		</div>

		<time
			class="ml-auto mr-2 text-gray-400 text-sm place-self-start whitespace-nowrap"
			:datetime="commonLastMessage.at(-1)?.createdAt?.toDate()"
			>{{ store.dateAgo(commonLastMessage.at(-1)?.createdAt) }}</time
		>
	</div>
</template>

<script setup>
import { onMounted, watchEffect, ref, onUnmounted } from 'vue'
import { useFirestore } from '../../stores/firestore'
import { useCounterStore } from '../../stores/counter'
import truncate from 'lodash.truncate'

const store = useCounterStore()

const fireStore = useFirestore()

const props = defineProps({
	userName: { type: String },
	userPhoto: {},
	gender: { type: String },
	friendUid: { type: String },
	currentUser: { type: String },
	online: { type: String },
})

const commonLastMessage = ref([])
const messageNotRead = ref([])

watchEffect(() => {
	commonLastMessage.value = fireStore.lastMessage
		.filter((user) =>
			user?.users.some((userId) => userId === props?.currentUser)
		)
		.filter((user) => user?.users.some((userId) => userId === props?.friendUid))

	messageNotRead.value = fireStore.messageRooms
		.filter((user) => user.ids.some((userId) => userId === props?.currentUser))
		.filter((user) => user.ids.some((userId) => userId === props?.friendUid))
})

onMounted(() => {
	fireStore.getLastMessages(props.friendUid)
	fireStore.ifMessageRead(props.currentUser, props.friendUid)
})

onUnmounted(() => {
	fireStore.clearLastMessage()

	fireStore.clearRoomMessage()
})

const getImageUrl = (name) => {
	return new URL(`../../assets/images/${name}`, import.meta.url).href
}
</script>

<style lang="scss" scoped></style>
