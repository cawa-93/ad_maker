import * as types from '../mutation-types'
import {clone, extend} from 'lodash'
import libs from 'libs'

const defaultState = {
	directLog:            [],
	currentDirectIndex:   -1,
	directPathHistory:    [],
	keywordsPathHistory:  [],
	keywordsTemplate:     [],
	fastLinksPathHistory: [],
	fastLinksTemplate:    []
}

let state = JSON.parse(localStorage.getItem('MAIN_LOCALSTORAGE_KEY'))
if (state && state.direct) state = state.direct

state = extend(defaultState, state)

const mutations = {
	[types.PUSH_PATH_HISTORY] (state, params) {
		const TARGET = params.target + 'PathHistory'
		if (!state[TARGET] || state[TARGET].find(p => p.path === params.item.path)) return

		state[TARGET].push(params.item)
		if (state[TARGET].length > 10);
		state[TARGET] = state[TARGET].splice(-10)
	},

	[types.CLEAR_DIRECT] (state) {
		state.directLog = []
		state.currentDirectIndex = -1
	},
	[types.CLEAR_KEYWORDS] (state) {
		state.keywordsTemplate = []
	},
	[types.CLEAR_FASTLINKS] (state) {
		state.fastLinksTemplate = []
	},

	[types.SET_DIRECT_INDEX] (state, newIndex) {
		if (!newIndex) newIndex = state.directLog.length - 1
		state.currentDirectIndex = newIndex
	},
	[types.SET_DIRECT] (state, direct) {
		if (!direct) return
		state.directLog.splice(state.currentDirectIndex + 1)
		state.directLog.push(direct)
	},

	[types.SET_KEYWORDS_TEMPLATE] (state, {template, type}) {
		if (type === 'adwords') { state.keywordsTemplate = template.filter((row, i) => i > 0 && row[0] && row[17] && row[37]).map(row => [row[0], row[17], row[37]]) } else			{ state.keywordsTemplate = template.splice(1) }

		state.keywordsTemplate.map(row => {
			row[2] = libs.clearKeyword(row[2].trim())
			return row
		})
	},
	[types.SET_KEYWORDS] (state, template) {
		const newDirectState = clone(state.directLog[state.currentDirectIndex])
		template.forEach(({campainName, groupName, keywords}) => {
			keywords.forEach(keyword => {
				let adIndex = newDirectState.findIndex(row => row && row[8] && row[3] && row[8].toUpperCase() === campainName.toUpperCase() && row[3].toUpperCase() === groupName.toUpperCase())
				if (adIndex < 0) return
				if (newDirectState[adIndex][10] !== '') {
					let newAd = clone(newDirectState[adIndex])
					newAd[0] = '-'
					newDirectState.splice(adIndex, 0, newAd)
					adIndex += 1
				} else {
					newDirectState[adIndex][0] = '-'
				}
				newDirectState[adIndex][10] = keyword
			})
		})
		state.directLog.push(newDirectState)
		state.keywordsTemplate = []
	},

	[types.SET_FASTLINKS_TEMPLATE] (state, {template, type}) {
		if (type === 'adwords') throw new Error('Загрузка быстрых ссылок из adwords не поддерживается')

		state.fastLinksTemplate = template
	},

	[types.SET_FASTLINKS] (state, template) {
		const cache = {}
		const newDirectState = state.directLog[state.currentDirectIndex].map((row, index) => {
			if (index < 3 || !row) return row

			const cacheKey = row[8] + row[3]
			if (!cache[cacheKey]) {
				const campain = template.find(({campainName, groupName}) => {
					return campainName.toUpperCase() === row[8].toUpperCase() && groupName.toUpperCase() === row[3].toUpperCase()
				})

				if (!campain) return row

				const titles = []
				const urls = []
				const descs = []

				campain.links.forEach(link => {
					if (!link.title || !link.url || !link.desc) return
					titles.push(link.title)
					urls.push(link.url)
					descs.push(link.desc)
				})

				cache[cacheKey] = {
					titles: titles.join('||'),
					urls:   urls.join('||'),
					descs:  descs.join('||')
				}
			}
			row[22] = cache[cacheKey].titles
			row[23] = cache[cacheKey].urls
			row[24] = cache[cacheKey].descs

			return row
		})

		state.directLog.push(newDirectState)
		state.fastLinksTemplate = []
	}
}

export default {
	state,
	mutations
}
