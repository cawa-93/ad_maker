import state from './Direct/state'
import * as mutations from './Direct/mutations'
import * as actions from './Direct/actions'
import * as getters from './Direct/getters'

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
}
