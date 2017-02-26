import Vue from 'vue'
import Electron from 'vue-electron'
import Router from 'vue-router'
import VueAnalytics from 'vue-ua'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'material-design-icons/iconfont/material-icons.css'

import pkg from './../../package.json';

import App from './App'
import routes from './routes'

Vue.use(Electron)
Vue.use(Router)
Vue.use(VueMaterial)
Vue.config.debug = process.env.NODE_ENV !== 'production'

Vue.material.registerTheme('default', {
  primary: {
    color: 'green',
    hue: 600
  },
  accent: {
    color: 'blue',
    hue: 900
  },
  warn: {
    color: 'deep-orange',
    hue: 700
  },
})

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

Vue.use(VueAnalytics, {
  appName: pkg.productName,
  appVersion: pkg.version,
  trackingId: 'UA-71609511-5',
  debug: process.env.NODE_ENV !== 'production',
  vueRouter: router,
})

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app')
