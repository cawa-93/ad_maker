const state = {
	darkMode: ((localStorage.getItem('darkMode') || 1) === 1),
}

const mutations = {
	TOGGLE (state, darkMode) {
		state.darkMode = darkMode || !state.darkMode
		localStorage.setItem('darkMode', state.darkMode ? 1 : 0)
	},
}

export default {
	namespaced: true,
	state,
	mutations,
}
