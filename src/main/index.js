'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import menuTemplate from './menu'

let mainWindow

function sendEventToWindow (channel, ...args) {
	if (mainWindow && mainWindow.webContents) {
		mainWindow.webContents.send(channel, ...args)
	}
}

function makeMenuClickable (menu) {
	return menu.map(item => {
		if (item.submenu !== undefined) {
			item.submenu = makeMenuClickable(item.submenu)
		}

		if (!item.click) {
			item.click = (...args) => sendEventToWindow('appMenu-onclick', ...args)
		}
		return item
	})
}

Menu.setApplicationMenu(Menu.buildFromTemplate(makeMenuClickable(menuTemplate)))

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:9080`
	: `file://${__dirname}/index.html`

function createWindow () {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		height: 563,
		useContentSize: true,
		width: 1000
	})

	mainWindow.loadURL(winURL)

	mainWindow.on('closed', () => {
		mainWindow = null
	})
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
	autoUpdater.quitAndInstall()
})

app.on('ready', () => {
	if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
