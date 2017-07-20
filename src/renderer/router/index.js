import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'load-direct',
			component: require('@/pages/LoadDirect'),
		},
		{
			path: '*',
			redirect: '/',
		},
	],
})
