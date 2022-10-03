<template>
	<form action="post" class="mx-6 mb-2 text-sm">
		<label class="relative">
			<SearchSvg />
			<input
				@click="store.redirectToSearchUsers()"
				@keyup="searchUser"
				v-model="search"
				ref="searchForUsers"
				type="text"
				class="w-full py-1 pr-3 pl-10 mb-2 tracking-wide text-gray-500 rounded-2xl placeholder:text-gray-300 bg-gray-100 shadow-inner border-none outline-gray-500 focus:bg-white transition-all duration-300 ease-in-out"
				placeholder="Search by Username"
			/>
		</label>
	</form>
</template>

<script setup>
import SearchSvg from './icons/SearchSvg.vue'
import { useCounterStore } from '../stores/counter'
import { onMounted, ref } from 'vue'
import debounce from 'lodash.debounce'

const store = useCounterStore()
const search = ref('')
const searchForUsers = ref(null)

const emit = defineEmits(['focusInput', 'searchUser'])

const searchUser = debounce(() => {
	emit('searchUser', store.validateSearchUserName(search.value))
}, 250)

onMounted(() => {
	emit('focusInput', searchForUsers.value)
})
</script>

<style lang="scss" scoped></style>
