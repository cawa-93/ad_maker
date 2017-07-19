const state = {
	direct: [],
	keywords: [],
	fastlinks: [],
}

const mutations = {
	ADD (state, {type, filepath}) {
		state[type].push(filepath)
	},
}

export default {
	state,
	mutations,
}
