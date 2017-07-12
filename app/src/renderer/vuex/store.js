import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import getters from './getters/index'
import modules from './modules'
// import plugins from './plugins'

Vue.use(Vuex)

export default new Vuex.Store({
	actions,
	getters,
	modules,
	// plugins,
	strict: process.env.NODE_ENV !== 'production'
})
