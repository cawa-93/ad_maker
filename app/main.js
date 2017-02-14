const electron = require('electron');
const {app, BrowserWindow, Tray, dialog} = electron;
const {autoUpdater} =  require("electron-auto-updater");
const path = require('path');
const fs = require('fs');

let mainWindow = null;

app.on('window-all-closed', () =>	process.platform !== 'darwin' && app.quit());
app.on('activate', () => mainWindow === null && createWindow());

app.on('ready', function () {
	const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
	mainWindow = new BrowserWindow({
		width: width,
		height: height,
		center: true,
		useContentSize: true,
		webContents: true,
		show: false
	});
	mainWindow.loadURL(path.join('file://', __dirname , '/index.html#/getDirect'));

	mainWindow.webContents.once("did-frame-finish-load", (event) => {
		mainWindow.show()
		autoUpdater.checkForUpdates();
	});
	mainWindow.on('closed', function() {
		mainWindow = null;
	})

	autoUpdater.addListener("update-available", (event) => {
		mainWindow.webContents.send('update-progress', 0);
	})
	autoUpdater.addListener("download-progress", (progress) => {
		mainWindow.webContents.send('update-progress', progress.percent);
	});
	autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
		mainWindow.webContents.send('update-progress', 100);
		dialog.showMessageBox({
			type: 'question',
			buttons: ['No', 'Yes'],
			title: 'Доступна новая версия',
			message:'Установить обновление прямо сейчас?',
			cancelId: 0,
			defaultId: 1,
		}, isInstall => isInstall && autoUpdater.quitAndInstall());
		return true;
	});
	autoUpdater.addListener("error", (error) => {
		mainWindow.webContents.send('update-progress', 100);		
		dialog.showMessageBox({
			type: 'error',
			buttons: ['OK'],
			message:'При проверке обновлений произошла ошибка',
			detail: error.toString()
		});
		console.error(error);
	});
});



