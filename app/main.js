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
		minWidth: 800,
		minHeight: 600,
		center: true,
		title: 'Ad Maker by Alex Kozack',
		useContentSize: true,
		webContents: true,
	});

	// mainWindow.webContents.openDevTools();

	mainWindow.loadURL(path.join('file://', __dirname , '/index.html#/getDirect')); //загрузка html файла

	mainWindow.on('closed', function() {
		mainWindow = null;
	});

	autoUpdater.addListener("update-available", (event) => {
		console.log("update-available")
	})
	autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
		console.log("update-downloaded");
		autoUpdater.quitAndInstall();
		return true;
	})
	autoUpdater.addListener("error", (error) => {
		// dialog.showMessageBox({
		// 	type: 'error',
		// 	buttons: ['OK'],
		// 	message:'При проверке обновлений произошла ошибка',
		// 	detail: error.toString()
		// });
		console.error(error);
	})
	autoUpdater.addListener("checking-for-update", (event) => {
		console.log("checking-for-update");
	})
	autoUpdater.addListener("update-not-available", () => {
		console.log("update-not-available");
	})

	mainWindow.webContents.once("did-frame-finish-load", (event) => {
		autoUpdater.checkForUpdates();
	})
});


app.on('activate', function () {

	if (mainWindow === null) {
		createWindow();
	}
});

