import { writeToPath } from 'fast-csv'

export default function writeCSV (path, data) {
	return new Promise(resolve => {
		writeToPath(path, data, {
			headers: false,
			delimiter: '\t',
		}).on('finish', resolve)
	})
}
