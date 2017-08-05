'use strict'
import { app, BrowserWindow, clipboard } from 'electron'
import { autoUpdater } from 'electron-updater'
import { Info } from '../common/dialog.js'

autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

let mainWindow
let clipboardInterval

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:9080`
	: `file://${__dirname}/../../index.html`
function createWindow () {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		title: `${app.getName()} v${app.getVersion()}`,
		height: 563,
		useContentSize: true,
		width: 1000,
		webPreferences: {
			devTools: true,
			webSecurity: false,
		},
	})

	mainWindow.on('page-title-updated', (event) => {
		event.preventDefault()
	})

	mainWindow.maximize()
	mainWindow.webContents.openDevTools()
	mainWindow.loadURL(winURL)

	mainWindow.on('closed', () => {
		mainWindow = null
		clearInterval(clipboardInterval)
	})

	/**
 * Clipboard onChange event
 *
 * https://github.com/electron/electron/issues/2280
 */

	let currentClipboard = null
	clipboardInterval = setInterval(() => {
		const newClipboard = clipboard.readText()
		if (!mainWindow || !mainWindow.webContents || newClipboard === currentClipboard) {
			return
		}
		currentClipboard = newClipboard
		mainWindow.webContents.send('clipboard-change', {value: currentClipboard})
	}, 100)
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

autoUpdater.on('error', (error) => {
	console.log('error', error)
	Info('error', error)
})

autoUpdater.on('checking-for-update', () => {
	console.log('checking-for-update')
	Info('checking-for-update')
})
autoUpdater.on('update-available', () => {
	console.log('update-available')
	Info('update-available')
})
autoUpdater.on('update-not-available', () => {
	console.log('update-not-available')
	Info('update-not-available')
})
autoUpdater.on('update-downloaded', (UpdateInfo) => {
	// console.log('Доступно обновление', 'Новая версия будет установлена после перезапуска')
	// Info('Доступно обновление', 'Новая версия будет установлена после перезапуска')
	console.log('update-downloaded', UpdateInfo)
	Info('update-downloaded', UpdateInfo)
})

app.on('ready', () => {
	Info('ready', 'ready')
	autoUpdater.checkForUpdates()
})
