import * as types from '../mutation-types'
import { cloneDeep, extend } from 'lodash'
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
		if (newIndex === undefined) newIndex = state.directLog.length - 1
		state.currentDirectIndex = newIndex
	},

	[types.CLEAR_REDO_STATES] (state) {
		state.directLog.splice(state.currentDirectIndex + 1)
		if (state.directLog.length > 5) {
			state.directLog.splice(0, 5)
		}
		state.currentDirectIndex = state.directLog.length - 1
	},

	[types.SET_DIRECT] (state, direct) {
		if (!direct) return
		state.directLog.push(direct)
	},

	[types.SET_KEYWORDS_TEMPLATE] (state, {template, type}) {
		if (type === 'adwords') {
			state.keywordsTemplate = template.filter((row, i) => i > 0 && row[0] && row[18] && row[38]).map(row => [row[0], row[18], row[38]])
		} else {
			state.keywordsTemplate = template.splice(1)
		}

		state.keywordsTemplate.map(row => {
			row[2] = libs.clearKeyword(row[2].trim())
			return row
		})
	},
	[types.SET_KEYWORDS] (state, template) {
		const newDirectState = cloneDeep(state.directLog[state.currentDirectIndex])
		template.forEach(({campaignName, groupName, keywords}) => {
			keywords.forEach(keyword => {
				let adIndex = newDirectState.findIndex(row => row && row[9] && row[3] && row[9].toUpperCase() === campaignName.toUpperCase() && row[3].toUpperCase() === groupName.toUpperCase())
				if (adIndex < 0) return
				if (newDirectState[adIndex][11] !== '') {
					let newAd = cloneDeep(newDirectState[adIndex])
					newAd[0] = '-'
					newDirectState.splice(adIndex, 0, newAd)
					adIndex += 1
				} else {
					newDirectState[adIndex][0] = '-'
				}
				newDirectState[adIndex][11] = keyword
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
		const newDirectState = cloneDeep(state.directLog[state.currentDirectIndex]).map((row, index) => {
			if (index < 3 || !row) return row

			const cacheKey = row[9] + row[3]
			if (!cache[cacheKey]) {
				const campaign = template.find(({campaignName, groupName}) => {
					return campaignName.toUpperCase() === row[9].toUpperCase() && groupName.toUpperCase() === row[3].toUpperCase()
				})

				if (!campaign) return row

				const titles = []
				const urls = []
				const descs = []

				campaign.links.forEach(link => {
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
			row[23] = cache[cacheKey].titles
			row[24] = cache[cacheKey].urls
			row[25] = cache[cacheKey].descs

			return row
		})

		state.directLog.push(newDirectState)
		state.fastLinksTemplate = []
	},

	[types.UTM_MARK_MAIN] (state, {params, mode}) {
		const newDirectState = cloneDeep(state.directLog[state.currentDirectIndex]).map((row, index) => {
			if (index < 3 || !row) return row

			const replaceData = {
				campaign_name: row[9],
				group_name:    row[3],
				ad_title:      row[13]
			}
			const utm = cloneDeep(params)

			for (let param in utm) {
				for (let key in replaceData) {
					const reg = new RegExp(`{${key}}`, 'g')
					utm[param] = utm[param].replace(reg, replaceData[key])
				}
			}
			row[14] = libs.utmMark(row[14], utm, mode === 'anchor')
			return row
		})
		state.directLog.push(newDirectState)
	},

	[types.UTM_MARK_FAST] (state, {params, mode}) {
		const newDirectState = cloneDeep(state.directLog[state.currentDirectIndex]).map((row, index) => {
			if (index < 3 || !row || !row[23] || !row[24]) return row

			const titles = row[23].split('||')
			row[24] = row[24].split('||').map((url, index) => {
				const replaceData = {
					campaign_name: row[9],
					group_name:    row[3],
					ad_title:      row[13],
					fastlink_name: titles[index]
				}
				const utm = cloneDeep(params)

				for (let param in utm) {
					for (let key in replaceData) {
						const reg = new RegExp(`{${key}}`, 'g')
						utm[param] = utm[param].replace(reg, replaceData[key])
					}
				}

				return libs.utmMark(url, utm, mode === 'anchor')
			}).join('||')

			return row
		})
		state.directLog.push(newDirectState)
	}
}

export default {
	state,
	mutations
}
