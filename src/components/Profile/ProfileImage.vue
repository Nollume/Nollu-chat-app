<template>
	<div
		@click="modal.showModal()"
		class="self-center w-16 aspect-square bg-gradient-to-br from-teal-300 to-indigo-500 rounded-full overflow-hidden cursor-pointer"
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
	</div>
</template>

<script setup>
import { watchEffect } from 'vue'

const props = defineProps({
	user: {
		type: Object,
	},
	modal: {},
})

const emit = defineEmits(['send-Url-image'])

watchEffect(() => {
	props.user.userPhoto
	emit('send-Url-image', props.user)
})

const getImageUrl = (name) => {
	return new URL(`../../assets/images/${name}`, import.meta.url).href
}
</script>

<style lang="scss" scoped></style>
