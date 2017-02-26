import * as types from './mutation-types'
import libs from 'libs'

export const CLEAR_ALL = ({commit}) => {
	commit(types.CLEAR_DIRECT)
	commit(types.CLEAR_KEYWORDS)
	// commit(types.CLEAR_FASTLINKS);
}

export const INIT_DIRECT = ({commit, state}, {path: fullPath}) => {
	if (!fullPath) throw new Error('Не указан путь к файлу')

	libs.parseCSV(libs.openFile(fullPath), {
		// headers:true,
		delimiter: '\t'
		// quote: null,
		// escape: '"'
	})
	.then(fileContent => {
		if (!fileContent || !fileContent[0] || !fileContent[0][0] || fileContent[0][0] !== 'Предложение текстовых блоков для рекламной кампании') {
			throw new Error('Данный файл имеет не извесную структуру')
		}
		commit(types.CLEAR_DIRECT)
		commit(types.SET_DIRECT, fileContent)
		commit(types.SET_DIRECT_INDEX)
		commit(types.PUSH_PATH_HISTORY, {target: 'direct', item: {path: fullPath}})
	})
	.catch(console.error)
}

export const SET_KEYWORDS_TEMPLATE = ({commit, state}, {type, path: fullPath}) => {
	if (!fullPath) throw new Error('Не указан путь к файлу')
	if (!type) throw new Error('Не установлен тип шаблона')

	return libs.parseCSV(libs.openFile(fullPath), {
		// headers:true,
		delimiter: '\t'
		// quote: null,
		// escape: '"'
	})
	.then(fileContent => {
		commit(types.SET_KEYWORDS_TEMPLATE, {
			type,
			template: fileContent
		})
		commit(types.PUSH_PATH_HISTORY, {target: 'keywords', item: {type, path: fullPath}})
	})
	.catch(console.error)
}

export const SET_KEYWORDS = ({commit, state}, template) => {
	if (!template) throw new Error('Ключевые слова не переданы')

	commit(types.SET_KEYWORDS, template)
	commit(types.SET_DIRECT_INDEX)
}

export const SET_FASTLINKS_TEMPLATE = ({commit, state}, {type, path: fullPath}) => {
	if (!fullPath) throw new Error('Не указан путь к файлу')
	if (!type) throw new Error('Не установлен тип шаблона')

	return libs.parseCSV(libs.openFile(fullPath), {
		// headers:true,
		delimiter: '\t'
		// quote: null,
		// escape: '"'
	})
	.then(fileContent => {
		commit(types.SET_FASTLINKS_TEMPLATE, {
			type,
			template: fileContent
		})
		commit(types.PUSH_PATH_HISTORY, {target: 'fastLinks', item: {type, path: fullPath}})
	})
	.catch(console.error)
}
