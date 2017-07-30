// import { remote } from 'electron'
import {openFile, parseCSV, writeCSV} from '@/helpers'
import {Error} from '@/../common/dialog'
import {directStates} from '@/datastore'

// export function UNDO ({commit, state}) {
// 	if (state.stackIndex > 0) {
// 		commit('SET_DIRECT_INDEX', state.stackIndex - 1)
// 	}
// }

// export function REDO ({commit, state}) {
// 	if (state.stackIndex < state.stack.length - 1) {
// 		commit('SET_DIRECT_INDEX', state.stackIndex + 1)
// 	}
// }

// export function CLEAR_ALL ({commit}) {
// 	const confirm = remote.dialog.showMessageBox({
// 		type: 'question',
// 		defaultId: 1,
// 		title: 'Подтвердите действие',
// 		message: 'Вы уверены, что хотите очистить всю информацию?',
// 		detail: 'Все не сохранённые изменения будут утеряны',
// 		cancelId: 0,
// 		buttons: ['Cancel', 'Yes'],
// 	})
// 	if (!confirm) return

// 	commit('CLEAR_DIRECT')
// 	commit('CLEAR_KEYWORDS')
// 	commit('CLEAR_FASTLINKS')
// }

// export function CLEAR_KEYWORDS ({commit}) {
// 	const confirm = remote.dialog.showMessageBox({
// 		type: 'question',
// 		defaultId: 1,
// 		title: 'Подтвердите действие',
// 		message: 'Вы уверены, что хотите очистить загруженные ключевые слова?',
// 		detail: 'Все не сохранённые изменения будут утеряны',
// 		cancelId: 0,
// 		buttons: ['Cancel', 'Yes'],
// 	})
// 	if (!confirm) return
// 	commit('CLEAR_KEYWORDS')
// }

// export function CLEAR_DIRECT ({commit}) {
// 	const confirm = remote.dialog.showMessageBox({
// 		type: 'question',
// 		defaultId: 1,
// 		title: 'Подтвердите действие',
// 		message: 'Вы уверены, что хотите очистить загруженные кампании?',
// 		detail: 'Все не сохранённые изменения будут утеряны',
// 		cancelId: 0,
// 		buttons: ['Cancel', 'Yes'],
// 	})
// 	if (!confirm) return
// 	commit('CLEAR_DIRECT')
// }

// export function CLEAR_FASTLINKS ({commit}) {
// 	const confirm = remote.dialog.showMessageBox({
// 		type: 'question',
// 		defaultId: 1,
// 		title: 'Подтвердите действие',
// 		message: 'Вы уверены, что хотите очистить загруженные быстрые ссылки?',
// 		detail: 'Все не сохранённые изменения будут утеряны',
// 		cancelId: 0,
// 		buttons: ['Cancel', 'Yes'],
// 	})
// 	if (!confirm) return
// 	commit('CLEAR_FASTLINKS')
// }

export async function initStack ({commit}, {filePath}) {
	// try {
	if (!filePath) {
		throw Error('Не указан путь к файлу')
	}

	let fileContent = await openFile(filePath)
	fileContent = await parseCSV(fileContent, {delimiter: '\t'})

	if (!fileContent || !fileContent[0] || !fileContent[0][0] || fileContent[0][0] !== 'Предложение текстовых блоков для рекламной кампании') {
		throw Error('Данный файл имеет не извесную структуру')
	}
	// commit('CLEAR_STACK')
	commit('INIT_COLUMNS', fileContent[2])
	commit('SET_DIRECT', fileContent)
	// commit('SET_STACK_INDEX')
	commit('RecentFiles/ADD', {type: 'direct', filePath}, {root: true})
	// } catch (e) {
	// Error('Ошибка', e)
	// }
}

export async function setKeywords ({commit}, {filePath}) {
	// try {
	let fileContent = await openFile(filePath)
	fileContent = await parseCSV(fileContent, {delimiter: '\t'})

	if (!fileContent) {
		throw Error('Данный файл имеет не извесную структуру')
	}

	commit('SET_KEYWORDS', fileContent)
	commit('RecentFiles/ADD', {type: 'keywords', filePath}, {root: true})
	// Info('Успешно', 'Ключевые фразы добавлены')
	// } catch (e) {
	// Error('Ошибка', e)
	// }
}

export async function setFastLinks ({commit}, {filePath}) {
	// try {
	let fileContent = await openFile(filePath)
	fileContent = await parseCSV(fileContent, {delimiter: '\t'})

	if (!fileContent) {
		throw Error('Данный файл имеет не извесную структуру')
	}

	commit('SET_FASTLINKS', fileContent)
	commit('RecentFiles/ADD', {type: 'fastLinks', filePath}, {root: true})
	// Info('Успешно', 'Быстрые ссылки добавлены')
	// } catch (e) {
	// Error('Ошибка', e)
	// }
}

export function utmTagging ({commit}, {options, type}) {
	// try {
	if (type === 'main') commit('UTM_MARK_MAINLINKS', options)
	else if (type === 'fast') commit('UTM_MARK_FASTLINKS', options)
	else throw Error('Не извесный тип ссылок для пометки')
	// Info('Успешно', 'Пометка завершена')
	// } catch (e) {
	// Error('Ошибка', e)
	// }
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
