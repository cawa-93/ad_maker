const fs = require('fs');

function ParseTSV(file_path, encoding = 'utf16le') {
	return new Promise(function (resolve, reject) {
		fs.readFile(file_path, encoding, function (err, data) {
			if (err) {
				return reject(err);
			}

			var res = data.split('\n').map(row => row.split('\t').map(item => item.trim()));
			resolve(res);
		});
	});
}

module.exports = ParseTSV;
