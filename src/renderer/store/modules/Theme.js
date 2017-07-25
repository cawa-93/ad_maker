const state = {
	darkMode: (localStorage.getItem('darkMode') === 1)
}

const mutations = {
	TOGGLE (state, darkMode) {
		state.darkMode = darkMode || !state.darkMode
	}
}

export default {
	namespaced: true,
	state,
	mutations,
}