import {directStates} from '@/datastore'

export default function syncDirectStates (store) {
	directStates.loadDatabase(err => {
		if (err) {
			throw err
		}

		directStates.remove({}, { multi: true })
	})

	store.subscribe(({type, payload}, state) => {
		if (
			type === 'Direct/INIT_DIRECT' ||
			type === 'Direct/SET_KEYWORDS' ||
			type === 'Direct/SET_FASTLINKS' ||
			type === 'Direct/UTM_MARK_MAINLINKS' ||
			type === 'Direct/UTM_MARK_FASTLINKS'
		) {
			directStates.insert(state.Direct, (err, newDoc) => {
				if (err) {
					throw err
				}

				store.commit('Direct/SAVE_STATE_ID', newDoc._id)
			})
		}
	})
}
