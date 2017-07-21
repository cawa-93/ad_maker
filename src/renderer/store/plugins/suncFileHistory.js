import {recentFiles} from '@/datastore'

export default function suncFileHistory (store) {
	recentFiles.loadDatabase(err => {
		if (err) {
			throw err
		}

		recentFiles.find({}, (err, docs) => {
			store.commit('RecentFiles/INIT', docs)
		})
	})

	store.subscribe(({type, payload}, state) => {
		if (type === 'RecentFiles/ADD') {
			recentFiles.remove({}, { multi: true }, (err, numRemoved) => {
				recentFiles.insert(state.RecentFiles.items)
			})
		}
	})
}
