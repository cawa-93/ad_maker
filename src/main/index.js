'use strict'
import { app, BrowserWindow/*, clipboard*/ } from 'electron'
// import { autoUpdater } from 'electron-updater'
// import { Info, Error } from 'common/dialog.js'
// import isDev from 'electron-is-dev'

let mainWindow
// let clipboardInterval

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
		width: 1000,
		height: 563,
		backgroundColor: '#303030',
		useContentSize: true,
		show: false,
		webPreferences: {
			devTools: true,
			webSecurity: false,
		},
	})

	mainWindow.on('page-title-updated', (event) => {
		event.preventDefault()
	})

	mainWindow.loadURL(winURL)
	mainWindow.maximize()
	mainWindow.show()
	// mainWindow.webContents.openDevTools()

	mainWindow.on('closed', () => {
		mainWindow = null
		// clearInterval(clipboardInterval)
	})

	/**
	 * Clipboard onChange event
	 *
	 * https://github.com/electron/electron/issues/2280
	 */

	// clipboardInterval = setInterval(() => {
	// 	const newClipboard = clipboard.readText()
	// 	if (!mainWindow || !mainWindow.webContents || newClipboard === currentClipboard) {
	// 		return
	// 	}
	// 	currentClipboard = newClipboard
	// 	mainWindow.webContents.send('clipboard-change', {value: currentClipboard})
	// }, 100)
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
// if (!isDev) {
// 	autoUpdater.on('error', (error) => {
// 		console.error(error)
// 		Error(error, 'Во время поиска обновлений произошла ошибка')
// 	})

// 	autoUpdater.on('update-downloaded', (UpdateInfo) => {
// 		console.log('Доступно обновление', UpdateInfo)
// 		Info('Доступно обновление', 'Новая версия будет установлена после перезапуска')
// 	})

// 	app.on('ready', () => {
// 		autoUpdater.checkForUpdates()
// 	})
// }
