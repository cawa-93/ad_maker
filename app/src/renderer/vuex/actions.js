import * as types from './mutation-types'
import libs from 'libs'
import { remote } from 'electron'

export const UNDO = ({commit, state}) => {
	if (state.direct.currentDirectIndex > 0) {
		commit(types.SET_DIRECT_INDEX, state.direct.currentDirectIndex - 1)
	}
}

export const REDO = ({commit, state}) => {
	if (state.direct.currentDirectIndex < state.direct.directLog.length - 1) {
		commit(types.SET_DIRECT_INDEX, state.direct.currentDirectIndex + 1)
	}
}

export const CLEAR_ALL = ({commit}) => {
	const confirm = remote.dialog.showMessageBox({
		type:      'question',
		defaultId: 1,
		title:     'Подтвердите действие',
		message:   'Вы уверены, что хотите очистить всю информацию?',
		detail:    'Все не сохранённые изменения будут утеряны',
		cancelId:  0,
		buttons:   ['Cancel', 'Yes']
	})
	if (!confirm) return

	commit(types.CLEAR_DIRECT)
	commit(types.CLEAR_KEYWORDS)
	commit(types.CLEAR_FASTLINKS)
}

export const CLEAR_KEYWORDS = ({commit}) => {
	const confirm = remote.dialog.showMessageBox({
		type:      'question',
		defaultId: 1,
		title:     'Подтвердите действие',
		message:   'Вы уверены, что хотите очистить загруженные ключевые слова?',
		detail:    'Все не сохранённые изменения будут утеряны',
		cancelId:  0,
		buttons:   ['Cancel', 'Yes']
	})
	if (!confirm) return
	commit(types.CLEAR_KEYWORDS)
}

export const CLEAR_DIRECT = ({commit}) => {
	const confirm = remote.dialog.showMessageBox({
		type:      'question',
		defaultId: 1,
		title:     'Подтвердите действие',
		message:   'Вы уверены, что хотите очистить загруженные кампании?',
		detail:    'Все не сохранённые изменения будут утеряны',
		cancelId:  0,
		buttons:   ['Cancel', 'Yes']
	})
	if (!confirm) return
	commit(types.CLEAR_DIRECT)
}

export const CLEAR_FASTLINKS = ({commit}) => {
	const confirm = remote.dialog.showMessageBox({
		type:      'question',
		defaultId: 1,
		title:     'Подтвердите действие',
		message:   'Вы уверены, что хотите очистить загруженные быстрые ссылки?',
		detail:    'Все не сохранённые изменения будут утеряны',
		cancelId:  0,
		buttons:   ['Cancel', 'Yes']
	})
	if (!confirm) return
	commit(types.CLEAR_FASTLINKS)
}

export const INIT_DIRECT = ({commit}, {path: fullPath}) => {
	try {
		if (!fullPath) throw new Error('Не указан путь к файлу')

		return libs.openFile(fullPath).then(c => libs.parseCSV(c, {delimiter: '\t'}))
		.then(fileContent => {
			if (!fileContent || !fileContent[0] || !fileContent[0][0] || fileContent[0][0] !== 'Предложение текстовых блоков для рекламной кампании') {
				throw new Error('Данный файл имеет не извесную структуру')
			}
			commit(types.CLEAR_DIRECT)
			commit(types.SET_DIRECT, fileContent)
			commit(types.SET_DIRECT_INDEX)
			commit(types.PUSH_PATH_HISTORY, {target: 'direct', item: {path: fullPath}})
		})
		.catch(e => new Notification('Ошибка', {body: e}))
	} catch (e) {
		new Notification('Ошибка', {body: e})
	}
}

export const SET_KEYWORDS_TEMPLATE = ({commit}, {type, path: fullPath}) => {
	try {
		if (!fullPath) throw new Error('Не указан путь к файлу')
		if (!type) throw new Error('Не установлен тип шаблона')

		return libs.openFile(fullPath).then(c => libs.parseCSV(c, {delimiter: '\t'}))
		.then(fileContent => {
			commit(types.SET_KEYWORDS_TEMPLATE, {
				type,
				template: fileContent
			})
			commit(types.PUSH_PATH_HISTORY, {target: 'keywords', item: {type, path: fullPath}})
		})
		.catch(e => new Notification('Ошибка', {body: e}))
	} catch (e) {
		 new Notification('Ошибка', {body: e})
	}
}

export const SET_KEYWORDS = ({commit}, template) => {
	try {
		if (!template) throw new Error('Ключевые слова не переданы')
		commit(types.CLEAR_REDO_STATES)
		commit(types.SET_KEYWORDS, template)
		commit(types.SET_DIRECT_INDEX)
		new Notification('Ключевые фразы добавлены')
	} catch (e) {
		new Notification('Ошибка', {body: e})
	}
}

export const SET_FASTLINKS_TEMPLATE = ({commit}, {type, path: fullPath}) => {
	try {
		if (!fullPath) throw new Error('Не указан путь к файлу')
		if (!type) throw new Error('Не установлен тип шаблона')

		return libs.openFile(fullPath).then(c => libs.parseCSV(c, {delimiter: '\t'}))
		.then(fileContent => {
			commit(types.SET_FASTLINKS_TEMPLATE, {
				type,
				template: fileContent
			})
			commit(types.PUSH_PATH_HISTORY, {target: 'fastLinks', item: {type, path: fullPath}})
		})
		.catch(e => new Notification('Ошибка', {body: e}))
	} catch (e) {
		new Notification('Ошибка', {body: e})
	}
}

export const SET_FASTLINKS = ({commit}, template) => {
	try {
		if (!template) throw new Error('Быстрые ссылки не переданы')
		commit(types.CLEAR_REDO_STATES)
		commit(types.SET_FASTLINKS, template)
		commit(types.SET_DIRECT_INDEX)
		new Notification('Быстрые ссылки добавлены')
	} catch (e) {
		new Notification('Ошибка', {body: e})
	}
}

export const UTM_MARK = ({commit}, {options, type}) => {
	try {
		commit(types.CLEAR_REDO_STATES)
		if (type === 'main') commit(types.UTM_MARK_MAIN, options)
		else if (type === 'fast') commit(types.UTM_MARK_FAST, options)
		else throw new Error('Не извесный тип ссылок для пометки')
		commit(types.SET_DIRECT_INDEX)
		new Notification('Пометка завершена')
	} catch (e) {
		new Notification('Ошибка', {body: e})
	}
}
