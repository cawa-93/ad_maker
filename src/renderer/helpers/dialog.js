import electron from 'electron'
import assignIn from 'lodash.assignin'
const dialog = (electron.dialog || electron.remote.dialog)

export function Error (title, content) {
	return dialog.showErrorBox(title, content)
}

export function Info (title, message) {
	const options = {
		message,
		type: 'info',
		buttons: ['OK'],
	}
	return dialog.showMessageBox(options, () => {})
}