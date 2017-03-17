import {shell} from 'electron'

export default [{
	label:   'Кампании',
	submenu: [{
		label:             'Загрузить',
		accelerator:       'CmdOrCtrl+O',
		proxyToMainWindow: true,
		id:                'open'
	}, {
		label:             'Сохранить как...',
		accelerator:       'CmdOrCtrl+S',
		proxyToMainWindow: true,
		id:                'save'
	}]
}, {
	label:   'Правка',
	submenu: [{
		label:             'Отменить',
		accelerator:       'CmdOrCtrl+Z',
		proxyToMainWindow: true,
		id:                'undo'
		// enabled:      false,
	}, {
		label:             'Повторить',
		accelerator:       'CmdOrCtrl+Y',
		proxyToMainWindow: true,
		id:                'redo'
		// enabled:      false,
	},
	{type: 'separator'},
	{
		label:   'Очистить...',
		submenu: [{
			label:             'Кампании',
			proxyToMainWindow: true,
			id:                'clear-direct'
		}, {
			label:             'Ключевые слова',
			proxyToMainWindow: true,
			id:                'clear-keywords'
		}, {
			label:             'Быстрые ссылки',
			proxyToMainWindow: true,
			id:                'clear-fastLinks'
		},
		{type: 'separator'},
		{
			label:             'Очистить всё',
			proxyToMainWindow: true,
			id:                'clear-all'
		}]
	}]
}, {
	label:   'Навигация',
	submenu: [{
		label:             'Следующая вкладка',
		proxyToMainWindow: true,
		id:                'next-tab',
		accelerator:       'CmdOrCtrl+Tab'
	}, {
		label:             'Предыдущая вкладка',
		proxyToMainWindow: true,
		id:                'before-tab',
		accelerator:       'CmdOrCtrl+Shift+Tab'
	},
	{type: 'separator'},
	{
		label:             'Обзор',
		proxyToMainWindow: true,
		id:                'goto',
		to:                'View'
	}, {
		label:             'Ключевые слова',
		proxyToMainWindow: true,
		id:                'goto',
		to:                'Keywords'
	}, {
		label:             'Быстрые ссылки',
		proxyToMainWindow: true,
		id:                'goto',
		to:                'FastLinks'
	}, {
		label:             'Пометка ссылок',
		proxyToMainWindow: true,
		id:                'goto',
		to:                'UtmMark'
	}
	]
}, {
	label:   'Справка',
	submenu: [{
		label:       'Открыть справку',
		accelerator: 'F1',
		click:       () => shell.openExternal('https://github.com/cawa-93/command-editor')
	}, {
		label:             'О программе',
		proxyToMainWindow: true,
		id:                'about'
	}]
}]
