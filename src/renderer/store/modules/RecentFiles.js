const state = {
	items: [],
}

const getters = {
	direct (state) {
		return state.items.filter(doc => doc.type === 'direct')
	},
	keywords (state) {
		return state.items.filter(doc => doc.type === 'keywords')
	},
	fastlinks (state) {
		return state.items.filter(doc => doc.type === 'fastlinks')
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
}

export default {
	namespaced: true,
	getters,
	state,
	mutations,
}
