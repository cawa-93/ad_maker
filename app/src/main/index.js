'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import menuTemplate from './menu'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:${require('../../../config').port}`
	: `file://${__dirname}/index.html`

const appMenu = Menu.buildFromTemplate(menuTemplate.map(menuItem => {
	menuItem = setProxyMenuClickAsCallBack(menuItem);
	if (menuItem.submenu) menuItem.submenu = menuItem.submenu.map(setProxyMenuClickAsCallBack);
	return menuItem;
}));
Menu.setApplicationMenu(appMenu);

function createWindow () {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		minHeight: 600,
		minWidth: 800, 
		useContentSize: true,
		// webContents: true,
	})

	mainWindow.loadURL(winURL)
	// mainWindow.webContents.openDevTools()

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	// eslint-disable-next-line no-console
	console.log('mainWindow opened')
}

function setProxyMenuClickAsCallBack(menuItem) {
	if (menuItem.click === true)
		menuItem.click = proxyMenuClick;
	if (menuItem.submenu) 
		menuItem.submenu = menuItem.submenu.map(setProxyMenuClickAsCallBack)
	return menuItem;
}

function proxyMenuClick (...args) {
	if (!mainWindow || !mainWindow.webContents) return;
	mainWindow.webContents.send('appMenu-onclick', args);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
