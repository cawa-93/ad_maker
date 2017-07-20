import cloneDeep from 'lodash.clonedeep'
import { utmMark } from '@/helpers'

export function CLEAR_STACK (state) {
	// state.stack = []
	// state.stackIndex = -1
}

export function SET_STACK_INDEX (state, newIndex) {
	if (newIndex === undefined) newIndex = state.stack.length - 1
	state.stackIndex = newIndex
}

export function STACK_ADD (state, direct) {
	if (!direct) return
	state.stack.push(direct)
}

export function INIT_COLUMNS (state) {
	const titlesRow = state.stack[state.stackIndex][2]
	state.columns.EXTA_AD = titlesRow.indexOf('Доп. объявление группы')
	state.columns.CAMPAIN_ID = titlesRow.indexOf('ID кампании (локальный)')
	state.columns.CAMPAIN_NAME = titlesRow.indexOf('Название кампании')
	state.columns.GROUPE_ID = titlesRow.indexOf('Номер группы')
	state.columns.GROUPE_NAME = titlesRow.indexOf('Название группы')
	state.columns.KEYWORD = titlesRow.indexOf('Фраза (с минус-словами)')
	state.columns.AD_TITLE = titlesRow.indexOf('Заголовок')
	state.columns.AD_TEXT = titlesRow.indexOf('Текст')
	state.columns.AD_URL = titlesRow.indexOf('Ссылка')
	state.columns.AD_ANCHOR = titlesRow.indexOf('Отображаемая ссылка')
	state.columns.BS_TITLES = titlesRow.indexOf('Заголовки быстрых ссылок')
	state.columns.BS_URLS = titlesRow.indexOf('Адреса быстрых ссылок')
	state.columns.BS_TEXTS = titlesRow.indexOf('Описания быстрых ссылок')
}

export function SET_KEYWORDS (state, template) {
	const newDirectState = cloneDeep(state.stack[state.stackIndex])
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
	state.stack.push(newDirectState)
	state.keywordsTemplate = []
}

export function SET_FASTLINKS (state, template) {
	const cache = {}
	const newDirectState = cloneDeep(state.stack[state.stackIndex]).map((row, index) => {
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
				urls: urls.join('||'),
				descs: descs.join('||'),
			}
		}
		row[23] = cache[cacheKey].titles
		row[24] = cache[cacheKey].urls
		row[25] = cache[cacheKey].descs

		return row
	})

	state.stack.push(newDirectState)
	state.fastLinksTemplate = []
}

export function UTM_MARK_MAINLINKS (state, {params, mode}) {
	const newDirectState = cloneDeep(state.stack[state.stackIndex]).map((row, index) => {
		if (index < 3 || !row) return row

		const replaceData = {
			campaign_name: row[9],
			group_name: row[3],
			ad_title: row[13],
		}
		const utm = cloneDeep(params)

		for (let param in utm) {
			for (let key in replaceData) {
				const reg = new RegExp(`{${key}}`, 'g')
				utm[param] = utm[param].replace(reg, replaceData[key])
			}
		}
		row[15] = utmMark(row[15], utm, mode === 'anchor')
		return row
	})
	state.stack.push(newDirectState)
}

export function UTM_MARK_FASTLINKS (state, {params, mode}) {
	const newDirectState = cloneDeep(state.stack[state.stackIndex]).map((row, index) => {
		if (index < 3 || !row || !row[23] || !row[24]) return row

		const titles = row[23].split('||')
		row[24] = row[24].split('||').map((url, index) => {
			const replaceData = {
				campaign_name: row[9],
				group_name: row[3],
				ad_title: row[13],
				fastlink_name: titles[index],
			}
			const utm = cloneDeep(params)

			for (let param in utm) {
				for (let key in replaceData) {
					const reg = new RegExp(`{${key}}`, 'g')
					utm[param] = utm[param].replace(reg, replaceData[key])
				}
			}

			return utmMark(url, utm, mode === 'anchor')
		}).join('||')

		return row
	})
	state.stack.push(newDirectState)
}
