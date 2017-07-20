const state = {
	direct: ['/home/alex/Downloads/direct.csv'],
	keywords: [],
	fastlinks: [],
}

const mutations = {
	ADD (state, {type, filePath}) {
		state[type].push(filePath)
	},
}

export default {
	namespaced: true,
	state,
	mutations,
}
