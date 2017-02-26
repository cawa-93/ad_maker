import {shell} from 'electron'
/**
 * Important!
 * "Click" property can only accept boolean value that will continue to be replaced by callback function
 */
export default [{
	label:   'Кампании',
	submenu: [{
		label:       'Открыть',
		accelerator: 'CmdOrCtrl+O',
		click:       true,
		id:          'open'
	}]
}, {
	label:   'Правка',
	submenu: [{
		label:       'Отменить',
		accelerator: 'CmdOrCtrl+Z',
		click:       true,
		enable:      false
	}, {
		label:       'Повторить',
		accelerator: 'CmdOrCtrl+Y',
		click:       true,
		enable:      false
	},
	{type: 'separator'},
	{
		label:   'Очистить...',
		submenu: [{
			label: 'Кампании',
			click: true,
			id:    'clear-direct'
		}, {
			label: 'Ключевые слова',
			click: true,
			id:    'clear-keywords'
		},
		// {
		// 	label: 'Быстрые ссылки',
		// 	click: true,
		// 	id: 'clear-fastLinks',
		// },
		{type: 'separator'},
		{
			label: 'Очистить всё',
			click: true,
			id:    'clear-all'
		}]
	}]
}, {
	label:   'Навигация',
	submenu: [{
		label:       'Следующая вкладка',
		click:       true,
		id:          'next-tab',
		accelerator: 'CmdOrCtrl+Tab'
	}, {
		label:       'Предыдущая вкладка',
		click:       true,
		id:          'before-tab',
		accelerator: 'CmdOrCtrl+Shift+Tab'
	}]
}, {
	label:   'Справка',
	submenu: [{
		label:       'Открыть справку',
		accelerator: 'F1',
		click:       () => shell.openExternal('https://github.com/cawa-93/command-editor')
	}, {
		label: 'О программе',
		click: true,
		id:    'about'
	}]
}]
