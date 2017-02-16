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
Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app')
