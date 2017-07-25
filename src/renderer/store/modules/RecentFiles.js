const state = {
	items: [],
}

const getters = {
	direct (state) {
		return state.items.filter(doc => doc.type === 'direct')
			.sort((doc1, doc2) => new Date(doc2.createdAt) - new Date(doc1.createdAt))
	},
	keywords (state) {
		return state.items.filter(doc => doc.type === 'keywords')
			.sort((doc1, doc2) => new Date(doc2.createdAt) - new Date(doc1.createdAt))
	},
	fastLinks (state) {
		return state.items.filter(doc => doc.type === 'fastLinks')
			.sort((doc1, doc2) => new Date(doc2.createdAt) - new Date(doc1.createdAt))
	},
}

const mutations = {
	INIT (state, databaseDocs) {
		state.items = databaseDocs
	},

	ADD (state, newDoc) {
		state.items = state.items.filter(doc => doc.filePath !== newDoc.filePath)
		newDoc.createdAt = new Date().toISOString()
		state.items.push(newDoc)
	},

	REMOVE (state, {type, filePath}) {
		state.items = state.items.filter(doc => !(doc.type === type && doc.filePath === filePath))
	},
}

export default {
	namespaced: true,
	getters,
	state,
	mutations,
}
