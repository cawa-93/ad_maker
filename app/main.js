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


    autoUpdater.addListener("update-available", (event) => {
      console.log("A new update is available")
    })
    autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
      console.log("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`)
      console.log("quitAndInstall")
      autoUpdater.quitAndInstall()
      return true
    })
    autoUpdater.addListener("error", (error) => {
      console.log(error);
    })
    autoUpdater.addListener("checking-for-update", (event) => {
      console.log("checking-for-update")
    })
    autoUpdater.addListener("update-not-available", () => {
      console.log("update-not-available")
    })

		mainWindow.webContents.once("did-frame-finish-load", (event) => {
      autoUpdater.checkForUpdates();
    })

	
	mainWindow = new BrowserWindow({
		width: 700,
		height: 510,
		// resizable:false,
		center: true,
		maximizable: false,
		title: 'Ad Maker by Alex Kozack',
		useContentSize: true,
		webContents: true,
	});

	// mainWindow.webContents.openDevTools();

	mainWindow.loadURL(path.join('file://', __dirname , '/index.html')); //загрузка html файла

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});


app.on('activate', function () {

	if (mainWindow === null) {
		createWindow();
	}
});

