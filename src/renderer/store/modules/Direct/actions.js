// import { remote } from 'electron'
import {openFile, parseCSV, writeCSV} from '@/helpers'
import {Error, Info} from '@/helpers/dialog'

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
	try {
		if (!filePath) {
			throw new Error('Не указан путь к файлу')
		}

		let fileContent = await openFile(filePath)
		fileContent = await parseCSV(fileContent, {delimiter: '\t'})

		if (!fileContent || !fileContent[0] || !fileContent[0][0] || fileContent[0][0] !== 'Предложение текстовых блоков для рекламной кампании') {
			throw new Error('Данный файл имеет не извесную структуру')
		}
		// commit('CLEAR_STACK')
		commit('INIT_COLUMNS', fileContent[2])
		commit('INIT_DIRECT', fileContent)
		// commit('SET_STACK_INDEX')
		commit('RecentFiles/ADD', {type: 'direct', filePath}, {root: true})
	} catch (e) {
		Error('Ошибка', e.toString())
	}
}

export async function setKeywords ({commit}, {filePath}) {
	try {
		let fileContent = await openFile(filePath)
		fileContent = await parseCSV(fileContent, {delimiter: '\t'})

		if (!fileContent) {
			throw new Error('Данный файл имеет не извесную структуру')
		}

		commit('SET_KEYWORDS', fileContent)
		commit('RecentFiles/ADD', {type: 'keywords', filePath}, {root: true})
		Info('Успешно', 'Ключевые фразы добавлены')
	} catch (e) {
		Error('Ошибка', e.toString())
	}
}

export async function setFastLinks ({commit}, {filePath}) {
	try {
		let fileContent = await openFile(filePath)
		fileContent = await parseCSV(fileContent, {delimiter: '\t'})

		if (!fileContent) {
			throw new Error('Данный файл имеет не извесную структуру')
		}

		commit('SET_FASTLINKS', fileContent)
		commit('RecentFiles/ADD', {type: 'fastLinks', filePath}, {root: true})
		Info('Успешно', 'Быстрые ссылки добавлены')
	} catch (e) {
		Error('Ошибка', e.toString())
	}
}

export function utmTagging ({commit}, {options, type}) {
	try {
		if (type === 'main') commit('UTM_MARK_MAINLINKS', options)
		else if (type === 'fast') commit('UTM_MARK_FASTLINKS', options)
		else throw new Error('Не извесный тип ссылок для пометки')
		Info('Успешно', 'Пометка завершена')
	} catch (e) {
		Error('Ошибка', e.toString())
	}
}

export async function SAVE_DIRECT ({getters}, {path}) {
	writeCSV(path, getters.direct)
}
