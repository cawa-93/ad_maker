import * as state from './Direct/state'
import * as mutations from './Direct/mutations'
import * as actions from './Direct/actions'

export default {
	namespaced: true,
	state: Object.assign({}, state),
	mutations,
	actions,
}
