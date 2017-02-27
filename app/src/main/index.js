'use strict'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import menuTemplate from './menu'
import { autoUpdater } from 'electron-updater'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:${require('../../../config').port}`
	: `file://${__dirname}/index.html`

const appMenu = Menu.buildFromTemplate(menuTemplate.map(menuItem => {
	menuItem = setProxyMenuClickAsCallBack(menuItem)
	if (menuItem.submenu) menuItem.submenu = menuItem.submenu.map(setProxyMenuClickAsCallBack)
	return menuItem
}))
Menu.setApplicationMenu(appMenu)

function createWindow () {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		minHeight:      600,
		minWidth:       800,
		useContentSize: true
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

function setProxyMenuClickAsCallBack (menuItem) {
	if (menuItem.click === true) { menuItem.click = proxyMenuClick }
	if (menuItem.submenu) { menuItem.submenu = menuItem.submenu.map(setProxyMenuClickAsCallBack) }
	return menuItem
}

function proxyMenuClick (...args) {
	sendToMainWindow('appMenu-onclick', args)
}

function sendToMainWindow (event, ...args) {
	if (!mainWindow || !mainWindow.webContents) return
	if (args.length === 1) args = args[0]
	mainWindow.webContents.send(event, args)
}

app.on('ready', () => {
	createWindow()
	autoUpdater.checkForUpdates()
	autoUpdater.addListener('update-available', () => sendToMainWindow('update-available'))
	autoUpdater.addListener('download-progress', progress => sendToMainWindow('update-progress', progress))
	autoUpdater.addListener('update-downloaded', () => sendToMainWindow('update-downloaded'))
	autoUpdater.addListener('error', () => sendToMainWindow('update-error'))

	ipcMain.once('update-install', () => autoUpdater.quitAndInstall())

	if (process.env.NODE_ENV === 'development') {
		// setInterval(() => {
		setTimeout(() => sendToMainWindow('update-available'), 1000)
		setTimeout(() => sendToMainWindow('update-progress', {percent: 10}), 2000)
		setTimeout(() => sendToMainWindow('update-progress', {percent: 20}), 3000)
		setTimeout(() => sendToMainWindow('update-progress', {percent: 30}), 4000)
		setTimeout(() => sendToMainWindow('update-progress', {percent: 40}), 5000)
		setTimeout(() => sendToMainWindow('update-progress', {percent: 50}), 6000)
		setTimeout(() => sendToMainWindow('update-progress', {percent: 60}), 7000)
		setTimeout(() => sendToMainWindow('update-progress', {percent: 70}), 8000)
		setTimeout(() => sendToMainWindow('update-downloaded'), 10000)
		// }, 12000)
	}
})

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
