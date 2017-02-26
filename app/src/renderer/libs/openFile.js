import fs from 'fs'
import {detect} from 'jschardet'
import {decode} from 'iconv-lite'

export default function openFile (path) {
	const fileBuffer = fs.readFileSync(path)
	var charset = detect(fileBuffer)
	if (!charset.encoding) throw new Error('Could not determine the file encoding')
	if (charset.encoding === 'MacCyrillic') charset.encoding = 'cp1251'
	return decode(fileBuffer, charset.encoding)
}
