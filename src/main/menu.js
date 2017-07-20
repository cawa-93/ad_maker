import {shell} from 'electron'

export default [{
	label: 'Кампании !',
	submenu: [{
		label: 'Загрузить',
		accelerator: 'CmdOrCtrl+O',
		id: 'open',
	}, {
		label: 'Сохранить как...',
		accelerator: 'CmdOrCtrl+S',
		id: 'save',
	}],
}, {
	label: 'Правка',
	submenu: [{
		label: 'Отменить',
		accelerator: 'CmdOrCtrl+Z',
		id: 'undo',
	}, {
		label: 'Повторить',
		accelerator: 'CmdOrCtrl+Y',
		id: 'redo',
	},
	{type: 'separator'},
	{
		label: 'Очистить...',
		submenu: [{
			label: 'Кампании',
			id: 'clear-direct',
		}, {
			label: 'Ключевые слова',
			id: 'clear-keywords',
		}, {
			label: 'Быстрые ссылки',
			id: 'clear-fastLinks',
		},
		{type: 'separator'},
		{
			label: 'Очистить всё',
			id: 'clear-all',
		}],
	}],
}, {
	label: 'Навигация',
	submenu: [{
		label: 'Следующая вкладка',
		id: 'next-tab',
		accelerator: 'CmdOrCtrl+Tab',
	}, {
		label: 'Предыдущая вкладка',
		id: 'before-tab',
		accelerator: 'CmdOrCtrl+Shift+Tab',
	},
	{type: 'separator'},
	{
		label: 'Обзор',
		id: 'goto',
		to: 'View',
	}, {
		label: 'Ключевые слова',
		id: 'goto',
		to: 'Keywords',
	}, {
		label: 'Быстрые ссылки',
		id: 'goto',
		to: 'FastLinks',
	}, {
		label: 'Пометка ссылок',
		id: 'goto',
		to: 'UtmMark',
	},
	],
}, {
	label: 'Справка',
	submenu: [{
		label: 'Открыть справку',
		accelerator: 'F1',
		click: () => shell.openExternal('https://github.com/cawa-93/command-editor'),
	}, {
		label: 'О программе',
		id: 'about',
	}],
}]
