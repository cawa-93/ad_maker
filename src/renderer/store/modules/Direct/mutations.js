import cloneDeep from 'lodash.clonedeep'
import { utmMark } from '@/helpers'

// export function CLEAR_STACK (state) {
// 	// state.stack = []
// 	// state.stackIndex = -1
// }

// export function SET_STACK_INDEX (state, newIndex) {
// 	console.log(newIndex, state.stack, state.stack.length)
// 	if (newIndex === undefined) newIndex = state.stack.length - 1
// 	state.stackIndex = newIndex
// }

export function SAVE_STATE_ID (state, docId) {
	state.prevStateId = state.currentStateId
	state.currentStateId = docId
}

export function INIT_DIRECT (state, direct) {
	if (!direct) return
	state.direct = direct
}
export function SET_DIRECT (state, direct) {
	if (!direct) return
	state.direct = direct
}

export function INIT_COLUMNS (state, titlesRow) {
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
	state.columns.FS_TITLES = titlesRow.indexOf('Заголовки быстрых ссылок')
	state.columns.FS_URLS = titlesRow.indexOf('Адреса быстрых ссылок')
	state.columns.FS_TEXTS = titlesRow.indexOf('Описания быстрых ссылок')
}

export function SET_KEYWORDS (state, fileContent) {
	const {CAMPAIN_NAME, GROUPE_NAME, KEYWORD} = state.columns
	fileContent.forEach(([campaignName, groupName, keyword]) => {
		let adIndex = state.direct.findIndex(row => row && row[CAMPAIN_NAME] && row[GROUPE_NAME] && row[CAMPAIN_NAME].toUpperCase() === campaignName.toUpperCase() && row[GROUPE_NAME].toUpperCase() === groupName.toUpperCase())
		if (adIndex < 0) return

		if (state.direct[adIndex][KEYWORD] !== '') {
			let newAd = cloneDeep(state.direct[adIndex])
			newAd[0] = '-'
			state.direct.splice(adIndex, 0, newAd)
			adIndex += 1
		} else {
			state.direct[adIndex][0] = '-'
		}
		state.direct[adIndex][KEYWORD] = keyword
	})
}

export function SET_FASTLINKS (state, fileContent) {
	const {CAMPAIN_NAME, GROUPE_NAME, FS_TITLES, FS_URLS, FS_TEXTS} = state.columns
	const _cache = {}
	state.direct = state.direct.map((row, index) => {
		if (index < 3 || !row) return row

		const cacheKey = row[CAMPAIN_NAME] + row[GROUPE_NAME]
		if (!_cache[cacheKey]) {
			const fsData = fileContent.find(fs => fs[0] === row[CAMPAIN_NAME] && fs[1] === row[GROUPE_NAME])

			if (!fsData) return row

			_cache[cacheKey] = {
				titles: `${fsData[2]}||${fsData[5]}||${fsData[8]}||${fsData[11]}`,
				urls: `${fsData[3]}||${fsData[6]}||${fsData[9]}||${fsData[13]}`,
				descs: `${fsData[4]}||${fsData[7]}||${fsData[10]}||${fsData[14]}`,
			}
		}

		row[FS_TITLES] = _cache[cacheKey].titles
		row[FS_URLS] = _cache[cacheKey].urls
		row[FS_TEXTS] = _cache[cacheKey].descs

		return row
	})
}

export function UTM_MARK_MAINLINKS (state, {params, mode}) {
	const {CAMPAIN_NAME, GROUPE_NAME, AD_TITLE, AD_URL} = state.columns
	state.direct = state.direct.map((row, index) => {
		if (index < 3 || !row) return row

		const replaceData = {
			campaign_name: row[CAMPAIN_NAME],
			group_name: row[GROUPE_NAME],
			ad_title: row[AD_TITLE],
		}
		const utm = cloneDeep(params)

		for (let param in utm) {
			for (let key in replaceData) {
				const reg = new RegExp(`{${key}}`, 'g')
				utm[param] = utm[param].replace(reg, replaceData[key])
			}
		}
		row[AD_URL] = utmMark(row[AD_URL], utm)
		return row
	})
}

export function UTM_MARK_FASTLINKS (state, {params, mode}) {
	const {CAMPAIN_NAME, GROUPE_NAME, FS_TITLES, FS_URLS} = state.columns
	state.direct = state.direct.map((row, index) => {
		if (index < 3 || !row || !row[FS_TITLES] || !row[FS_URLS]) return row

		const titles = row[FS_TITLES].split('||')
		row[FS_URLS] = row[FS_URLS].split('||').map((url, index) => {
			const replaceData = {
				campaign_name: row[CAMPAIN_NAME],
				group_name: row[GROUPE_NAME],
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
}
