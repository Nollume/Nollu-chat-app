import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/contact',
			name: 'contact',
			component: () => import('../views/ContactView.vue'),
		},
		{
			path: '/search-Users',
			name: 'search-Users',
			component: () => import('../views/FindUsers.vue'),
		},
		{
			path: '/person/:id/:uId',
			name: 'person',
			component: () => import('../views/PersonView.vue'),
			props: true,
		},
		{
			path: '/profile/:id',
			name: 'profile',
			component: () => import('../views/ProfileView.vue'),
			props: true,
			children: [
				{
					path: ':friends',
					name: 'friends',
					component: () => import('../views/FriendsView.vue'),
					props: true,
				},
			],
		},

		{
			path: '/register',
			name: 'register',
			component: () => import('../views/RegisterView.vue'),
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginView.vue'),
		},
		{
			path: '/update-name',
			name: 'update-name',
			component: () => import('../views/UpdateUserName.vue'),
		},
		{
			path: '/update-email',
			name: 'update-email',
			component: () => import('../views/UpdateEmail.vue'),
		},
		{
			path: '/notifications',
			name: 'notifications',
			component: () => import('../views/NotificationsApp.vue'),
		},
		{
			path: '/Update-Password',
			name: 'UpdatePassword',
			component: () => import('../views/UpdatePassword.vue'),
		},
		{
			path: '/:patchMatch(.*)',
			name: 'not-found',
			component: () => import('../views/PageNotFound.vue'),
		},
	],
})

export default router
