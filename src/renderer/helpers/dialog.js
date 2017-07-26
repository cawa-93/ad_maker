import electron from 'electron'
const dialog = (electron.dialog || electron.remote.dialog)

export function Error (content = '', title = '') {
	if (typeof title === 'object') title = title.toString()
	if (typeof content === 'object') content = content.toString()
	dialog.showErrorBox(title, content)
	return new global.Error(content)
}

export function Info (title, message) {
	const options = {
		message,
		type: 'info',
		buttons: ['OK'],
	}
	return dialog.showMessageBox(options, () => {})
}
