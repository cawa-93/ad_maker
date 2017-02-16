import * as types from '../mutation-types'
import plugins from './plugins'

export const MAIN_LOCALSTORAGE_KEY = 'MAIN_LOCALSTORAGE_KEY';

const state = JSON.parse(localStorage.getItem(MAIN_LOCALSTORAGE_KEY)) || {
  directLog: [],
  currentDirectIndex: -1,
}

const mutations = {
  [types.CLEAR_DIRECT] (state) {
    state.directLog = [];
    state.currentDirectIndex = -1;
  },
  [types.SET_DIRECT_INDEX] (state, newIndex) {
    if (!newIndex) newIndex = state.directLog.length -1;
    state.currentDirectIndex = newIndex;
  },
  [types.SET_DIRECT] (state, direct) {
    if (!direct) return;
    state.directLog.splice(state.currentDirectIndex+1);
    state.directLog.push(direct);
  }
}

export default {
  state,
  mutations,
  plugins
}
