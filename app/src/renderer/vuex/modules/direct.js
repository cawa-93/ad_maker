import * as types from '../mutation-types'
import {clone} from 'lodash';
import libs from 'libs'

let state = JSON.parse(localStorage.getItem('MAIN_LOCALSTORAGE_KEY'));
if (state && state.direct) state = state.direct
else state = {
	directLog: [],
	currentDirectIndex: -1,
	directPathHistory: [],
	keywordsPathHistory: [],
	keywordsTemplate: [],
	fastLinksPathHistory: [],
}

const mutations = {
	[types.PUSH_PATH_HISTORY] (state, params) {
		const TARGET = params.target + 'PathHistory';
		if (!state[TARGET] || state[TARGET].find(p => p.path === params.item.path)) return;

		state[TARGET].push(params.item);
		if (state[TARGET].length > 10);
			state[TARGET] = state[TARGET].splice(-10);
	},

	[types.CLEAR_DIRECT] (state) {
		console.log('CLEAR_DIRECT')
		state.directLog = [];
		state.currentDirectIndex = -1;
	},
	[types.CLEAR_KEYWORDS] (state) {
		console.log('CLEAR_KEYWORDS')
		state.keywordsTemplate = [];
	},
	// [types.CLEAR_FASTLINKS] (state) {
	// 	state.directLog = [];
	// 	state.currentDirectIndex = -1;
	// },

	[types.SET_DIRECT_INDEX] (state, newIndex) {
		if (!newIndex) newIndex = state.directLog.length -1;
		state.currentDirectIndex = newIndex;
	},
	[types.SET_DIRECT] (state, direct) {
		if (!direct) return;
		state.directLog.splice(state.currentDirectIndex+1);
		state.directLog.push(direct);
	},

	[types.SET_KEYWORDS_TEMPLATE] (state, {template, type}) {
		if (type === 'adwords')
			state.keywordsTemplate = template.filter((row, i) => i > 0 && row[0] && row[17] && row[37]).map(row => [row[0], row[17], row[37]])
		else 
			state.keywordsTemplate = template.splice(1);

			state.keywordsTemplate.map(row => {
				row[2] = libs.clearKeyword(row[2].trim())
				return row;
			})
	},
	[types.SET_KEYWORDS] (state, template) {
		const newDirectState = clone(state.directLog[state.currentDirectIndex]);
		template.forEach(({campain_name, group_name, keywords}) => {
			keywords.forEach(keyword => {
				let adIndex = newDirectState.findIndex(row => row && row[8] && row[3] && row[8].toUpperCase() == campain_name.toUpperCase() && row[3].toUpperCase() == group_name.toUpperCase());
				if (adIndex < 0) return;
				if (newDirectState[adIndex][10] != '') {
					let new_ad = clone(newDirectState[adIndex]);
					new_ad[0] = '-';
					newDirectState.splice(adIndex,0,new_ad);
					adIndex += 1;
				} else {
					newDirectState[adIndex][0] = '-';
				}
				newDirectState[adIndex][10] = keyword;
			})
		})
		state.directLog.push(newDirectState);
		state.keywordsTemplate = [];
	},

	[types.SET_FASTLINKS_TEMPLATE] () {
		
	}
}

export default {
	state,
	mutations
}
