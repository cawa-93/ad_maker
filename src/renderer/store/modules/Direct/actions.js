// import { remote } from 'electron'
import {openFile, parseCSV, writeCSV} from '@/helpers'

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
	if (!filePath) {
		throw new Error('Не указан путь к файлу')
	}

	let fileContent = await openFile(filePath)
	fileContent = await parseCSV(fileContent, {delimiter: '\t'})

	if (!fileContent || !fileContent[0] || !fileContent[0][0] || fileContent[0][0] !== 'Предложение текстовых блоков для рекламной кампании') {
		throw new Error('Данный файл имеет не извесную структуру')
	}
	// commit('CLEAR_STACK')
	commit('INIT_DIRECT', fileContent)
	// commit('SET_STACK_INDEX')
	commit('INIT_COLUMNS')
	commit('RecentFiles/ADD', {type: 'direct', filePath}, {root: true})
}

export function SET_KEYWORDS ({commit}, template) {
	try {
		if (!template) throw new Error('Ключевые слова не переданы')
		commit('CLEAR_REDO_STATES')
		commit('SET_KEYWORDS', template)
		commit('SET_DIRECT_INDEX')
		console.error('Ключевые фразы добавлены')
	} catch (e) {
		console.error('Ошибка', {body: e})
	}
}

export function SET_FASTLINKS ({commit}, template) {
	try {
		if (!template) throw new Error('Быстрые ссылки не переданы')
		commit('CLEAR_REDO_STATES')
		commit('SET_FASTLINKS', template)
		commit('SET_DIRECT_INDEX')
		console.error('Быстрые ссылки добавлены')
	} catch (e) {
		console.error('Ошибка', {body: e})
	}
}

export function UTM_MARK ({commit}, {options, type}) {
	try {
		commit('CLEAR_REDO_STATES')
		if (type === 'main') commit('UTM_MARK_MAIN', options)
		else if (type === 'fast') commit('UTM_MARK_FAST', options)
		else throw new Error('Не извесный тип ссылок для пометки')
		commit('SET_DIRECT_INDEX')
		console.error('Пометка завершена')
	} catch (e) {
		console.error('Ошибка', {body: e})
	}
}

export async function SAVE_DIRECT ({getters}, {path}) {
	writeCSV(path, getters.direct)
}
