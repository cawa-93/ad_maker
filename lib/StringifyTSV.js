const fs = require('fs');

function StringifyTSV(file_path, data) {
	return new Promise(function (resolve, reject) {
		var tsv_string = data.map(row => row.join(`\t`)).join(`\n`);

		fs.writeFile(file_path, tsv_string, 'utf8', function (err) {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
}

module.exports = StringifyTSV;
