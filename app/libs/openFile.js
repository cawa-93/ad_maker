const jschardet = require("jschardet");
const iconv = require('iconv-lite');
const fs = require('fs');

function openFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, function (err, file_buffer) {
			if (err) return reject(err);

			const file_encoding = jschardet.detect(file_buffer).encoding;
			alert('encoding: ' + file_encoding);
			if (!file_encoding) reject('Не удалось определить кодировку');
			resolve( iconv.decode(file_buffer, file_encoding) );
		})
	})
}

module.exports = openFile;
