import {recentFiles} from '@/datastore'
import fs from 'fs'

export default function suncFileHistory (store) {
	recentFiles.loadDatabase(err => {
		if (err) {
			throw err
		}

		recentFiles.find({}, (err, docs) => {
			store.commit('RecentFiles/INIT', docs)
			docs.forEach(doc => {
				fs.access(doc.filePath, (err) => {
					if (err && err.code === 'ENOENT') {
						store.commit('RecentFiles/REMOVE', doc)
					}
				})
			})
		})
	})

	store.subscribe(({type, payload}, state) => {
		if (type === 'RecentFiles/ADD' || type === 'RecentFiles/REMOVE') {
			recentFiles.remove({}, { multi: true }, (err, numRemoved) => {
				recentFiles.insert(state.RecentFiles.items)
			})
		}
	})
}
