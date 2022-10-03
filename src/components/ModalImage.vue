<template>
	<dialog ref="modalImage" class="p-1 list" @click="closeModal">
		<img
			:src="
				user?.userPhoto
					? user?.userPhoto
					: user?.gender === 'male'
					? getImageUrl('avatar1.png')
					: getImageUrl('avatar2.png')
			"
			alt="avatar image"
		/>
	</dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const modalImage = ref(null)

const props = defineProps({
	user: { type: Object },
})

const emit = defineEmits(['openModal'])

onMounted(() => {
	emit('openModal', modalImage.value)
})
const closeModal = () => {
	modalImage.value.close()
}
const getImageUrl = (name) => {
	return new URL(`../assets/images/${name}`, import.meta.url).href
}
</script>
