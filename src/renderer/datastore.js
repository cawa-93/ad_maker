import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

export const recentFiles = new Datastore({
	filename: path.join(remote.app.getPath('userData'), '/recentFiles.db'),
})

export default {
	recentFiles,
}
