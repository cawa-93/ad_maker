const getWithoutQuotes = require('./getWithoutQuotes');
const get_template_empty = require('./get_template_empty');
const ParseTSV = require('./ParseTSV');

function get_template_direct(file_path) {
    return ParseTSV(file_path).then(data => {
        var cols = get_template_empty();
        
        data.forEach((row, i) => {
            if (i < 3 || !row[8] || !row[3] || !row[10] || !row[22] || !row[23] || !row[24]) return;
            var result = [
                getWithoutQuotes(row[8]),  // Campain
                getWithoutQuotes(row[3]),  // Group
                getWithoutQuotes(row[10]), // keyword
                // row[22],
                // row[23],
                // row[24],
            ];
            var titles = getWithoutQuotes(row[22]).split('||');
            var urls = getWithoutQuotes(row[23]).split('||');
            var descs = getWithoutQuotes(row[24]).split('||');
            urls.forEach((url, i) => {
                result = result.concat([titles[i], url, descs[i]]);
            });

            cols.push(result);
        })

	    return cols;
    });
}

module.exports = get_template_direct;
