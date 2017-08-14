import fs from 'fs'
import {detect} from 'jschardet'
import {decode} from 'iconv-lite'

export default async function openFile (path) {
	const fileBuffer = await fsReadFilePromise(path)
	var charset = detect(fileBuffer)
	if (!charset.encoding) throw new Error('Could not determine the file encoding')
	if (charset.encoding === 'MacCyrillic') charset.encoding = 'cp1251' // Костыль
	return decode(fileBuffer, charset.encoding)
}

export function fsReadFilePromise (filePath, options) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, options, (err, data) => {
			if (err) {
				reject(err)
				return
			}

			resolve(data)
		})
	})
};
