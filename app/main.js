const {app, BrowserWindow, Tray, dialog} = require('electron');
const {autoUpdater} =  require("electron-auto-updater");
const path = require('path');
const fs = require('fs');

let mainWindow = null;
app.setName('Ad maker');

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		minWidth: 1000,
		minHeight: 500,
		center: true,
		title: 'Ad Maker by Alex Kozack',
		useContentSize: true,
		webContents: true,
	});
	mainWindow.maximize()
	mainWindow.loadURL(path.join('file://', __dirname , '/index.html#/getDirect'))
	mainWindow.on('closed', function() {
		mainWindow = null;
	})
	mainWindow.webContents.once("did-frame-finish-load", (event) => {
		autoUpdater.checkForUpdates();
	});

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


app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});

