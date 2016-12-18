var {app, BrowserWindow, Tray} = require('electron');
var path = require('path');

var mainWindow = null;

app.setName('Ad maker');

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function () {
	
	mainWindow = new BrowserWindow({
		width: 700,
		height: 510,
		resizable:false,
		center: true,
		maximizable: false,
		title: 'Ad Maker by Alex Kozack',
		icon: path.join('file://', __dirname , '/imgs/electron.png'),
		useContentSize: true
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
