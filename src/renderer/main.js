import Vue from 'vue'
import axios from 'axios'

import 'material-design-icons/iconfont/material-icons.css'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App'
import router from './router'
import store from './store'

Vue.use(Vuetify)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	components: { App },
	router,
	store,
	template: '<App/>',
}).$mount('#app')
