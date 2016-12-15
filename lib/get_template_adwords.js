const get_template_empty = require('./get_template_empty');
const ParseTSV = require('./ParseTSV');

function get_template_adwords(file_path) {
    return ParseTSV(file_path).then(data => {
        var cols = get_template_empty();
        const keywords = data.filter((row, i) => {
            return i > 0 && row[0] && row[17] && row[37];
        });

        const links = data.filter((row, i) => {
            return i > 0 && row[0] && row[17] && row[43] && row[46] && row[47] && row[48];
        });

        keywords.forEach((ad, i) => {

            if (ad[0] && ad[17] && ad[37]) {
                let result = [ad[0],  ad[17], ad[37].replace(/\+/g, '')];
                let currentLinks = [];
                let removedIndex = [];
                for (var i = links.length - 1; i >= 0; i--) {
                    if (links[i][0] === ad[0] && links[i][17] === ad[17] && links[i][43] && links[i][46] && links[i][47] && links[i][48]) {
                        currentLinks.push(links[i]);
                        removedIndex.push(i);
                    }

                    if (currentLinks.length === 4) {
                        removedIndex.forEach(i => links.splice(i,1));
                        break;
                    }
                }
                currentLinks.forEach(row => {
                    result = result.concat([row[46], row[43], `${row[47]} ${row[48]}`]);
                });
                cols.push(result);
            }
        });

	    return cols;
    });
}

module.exports = get_template_adwords;
