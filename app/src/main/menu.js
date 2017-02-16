import {shell} from 'electron';
/**
 * Important!
 * "Click" property can only accept boolean value that will continue to be replaced by callback function
 */
export default [{
	label: 'Кампании',
	submenu: [{
		label: 'Открыть',
		accelerator: 'CmdOrCtrl+O',
		click: true
	}]
},{
	label: 'Правка',
	submenu: [{
		label: 'Отменить',
		accelerator: 'CmdOrCtrl+Z',
		click: true
	},{
		label: 'Повторить',
		accelerator: 'CmdOrCtrl+Y',
		click: true
	},{
		type: 'separator'
	},{
		label: 'Очистить',
		click: true
	}]
},{
	label: 'Справка',
	submenu: [{
		label: 'Открыть справку',
		accelerator: 'F1',
		click: () => shell.openExternal('https://github.com/cawa-93/ad_maker')
	},{
		label: 'О программе',
		click: true
	}]
}];