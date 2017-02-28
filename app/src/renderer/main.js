import Vue from 'vue'
import Electron from 'vue-electron'
import Router from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'material-design-icons/iconfont/material-icons.css'

import App from './App'
import routes from './routes'

Vue.use(Electron)
Vue.use(Router)
Vue.use(VueMaterial)
Vue.config.debug = process.env.NODE_ENV !== 'production'

Vue.material.registerTheme('default', {
	primary: {
		color: 'green',
		hue:   600
	},
	accent: {
		color: 'blue',
		hue:   900
	},
	warn: {
		color: 'red',
		hue:   'A700'
	}
})

const router = new Router({
	scrollBehavior: () => ({ y: 0 }),
	routes
})

/* eslint-disable no-new */
new Vue({
	router,
	...App
}).$mount('#app')
