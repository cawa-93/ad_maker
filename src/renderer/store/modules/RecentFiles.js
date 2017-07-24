const state = {
	items: [],
}

const getters = {
	direct (state) {
		return state.items.filter(doc => doc.type === 'direct').map(f => f.filePath)
	},
	keywords (state) {
		return state.items.filter(doc => doc.type === 'keywords').map(f => f.filePath)
	},
	fastLinks (state) {
		return state.items.filter(doc => doc.type === 'fastLinks').map(f => f.filePath)
	},
}

const mutations = {
	INIT (state, databaseDocs) {
		state.items = databaseDocs
	},

	ADD (state, newDoc) {
		state.items = state.items.filter(doc => doc.filePath !== newDoc.filePath)
		state.items.push(newDoc)
	},

	REMOVE (state, {type, filePath}) {
		state.items = state.items.filter(doc => !(doc.type === type && doc.filePath === filePath))
	}
}

export default {
	namespaced: true,
	getters,
	state,
	mutations,
}
