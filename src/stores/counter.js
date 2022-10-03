import { defineStore } from 'pinia'
import capitalize from 'lodash.capitalize'
import deburr from 'lodash.deburr'

import router from '@/router/index.js'
import moment from 'moment'

export const useCounterStore = defineStore({
	id: 'counter',
	state: () => ({}),
	getters: {},
	actions: {
		redirectToHome() {
			router.push({ name: 'home' })
		},
		reload() {
			window.location.reload()
		},
		redirectToBack() {
			router.go(-1)
		},
		redirectToRegister() {
			router.push({ name: 'register' })
		},
		redirectToLogin() {
			router.push({ name: 'login' })
		},
		redirectToSearchUsers() {
			router.push({ name: 'search-Users' })
		},
		redirectToContacts() {
			router.push({ name: 'contact' })
		},
		redirectToUpdateUserName() {
			router.push({ name: 'update-name' })
		},
		redirectToEmailAddress() {
			router.push({ name: 'update-email' })
		},
		dateAgo(firebaseTimestampObject) {
			const date = firebaseTimestampObject?.toDate()
			return moment(date).fromNow()
		},
		niceDate(date) {
			return moment(date).format('LL')
		},
		validateUserName(name) {
			const validate = deburr(capitalize(name))
				.replace(/[^\w\s]/gi, '')
				.replace(/ {2,}/g, ' ')
				.replace(/ /g, '')
				.trim()

			return validate
		},
		validateSearchUserName(name) {
			const validate = deburr(name)
				.toLowerCase()
				.replace(/[^\w\s]/gi, '')
				.replace(/ {2,}/g, ' ')
				.replace(/ /g, '')
				.trim()

			return validate
		},
		getAge(dateString) {
			const today = new Date()
			const birthDate = new Date(dateString)
			let age = today.getFullYear() - birthDate.getFullYear()
			const m = today.getMonth() - birthDate.getMonth()
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--
			}

			return age
		},
	},
})
