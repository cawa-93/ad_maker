import {openFile, parseCSV, writeCSV} from '@/helpers'
import {Error} from 'common/dialog'
import {directStates} from '@/datastore'
export async function initStack ({commit}, {filePath}) {
	if (!filePath) {
		throw Error('Не указан путь к файлу')
	}

	let fileContent = await openFile(filePath)
	fileContent = await parseCSV(fileContent, {delimiter: '\t'})

	if (!fileContent || !fileContent[0] || !fileContent[0][0] || fileContent[0][0] !== 'Предложение текстовых блоков для рекламной кампании') {
		throw Error('Данный файл имеет не извесную структуру')
	}
	commit('INIT_COLUMNS', fileContent[2])
	commit('SET_DIRECT', fileContent)
	commit('RecentFiles/ADD', {type: 'direct', filePath}, {root: true})
}

export async function setKeywords ({commit}, {filePath}) {
	let fileContent = await openFile(filePath)
	fileContent = await parseCSV(fileContent, {delimiter: '\t'})

	if (!fileContent) {
		throw Error('Данный файл имеет не извесную структуру')
	}

	commit('SET_KEYWORDS', fileContent)
	commit('RecentFiles/ADD', {type: 'keywords', filePath}, {root: true})
}

export async function setFastLinks ({commit}, {filePath}) {
	let fileContent = await openFile(filePath)
	fileContent = await parseCSV(fileContent, {delimiter: '\t'})

	if (!fileContent) {
		throw Error('Данный файл имеет не извесную структуру')
	}

	commit('SET_FASTLINKS', fileContent)
	commit('RecentFiles/ADD', {type: 'fastLinks', filePath}, {root: true})
}

export function utmTagging ({commit}, {options, type}) {
	if (type === 'main') commit('UTM_MARK_MAINLINKS', options)
	else if (type === 'fast') commit('UTM_MARK_FASTLINKS', options)
	else throw Error('Не извесный тип ссылок для пометки')
}

export async function write ({state}, filePath) {
	await writeCSV(filePath, state.direct)
}

export function loadState ({commit, state}, direction) {
	const _id = state[`${direction}StateId`]
	if (!_id) {
		throw Error('Не удалось найти ID состояния')
	}
	directStates.findOne({ _id }, function (err, state) {
	  if (err) {
			throw Error(err)
		}
		if (!state.currentStateId) {
			state.currentStateId = state._id
		}

		commit('SET_STATE', state)
	})
}
