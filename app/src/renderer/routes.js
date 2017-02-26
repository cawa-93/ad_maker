export default [
	{
		path: '/',
		name: 'View',
		component: resolve => require(['components/View.vue'], resolve),
		props: true
	},
	{
		path: '/about',
		name: 'About',
		component: resolve => require(['components/About.vue'], resolve)
	},
	{
		path: '/keywords',
		name: 'Keywords',
		component: resolve => require(['components/Keywords.vue'], resolve)
	},
	{
		path: '/fastLinks',
		name: 'FastLinks',
		component: resolve => require(['components/FastLinks.vue'], resolve)
	},	{
		path: '/utm',
		name: 'UtmMark',
		component: resolve => require(['components/utmMark.vue'], resolve)
	},
	{
		path: '*',
		redirect: '/'
	}
]
