function parseFromAdwords(data) {
	const keywords = data.filter((row, i) => i > 0 && row[0] && row[17] && row[37]);
	const rows = [];
	keywords.forEach((ad, i) => {
			let row = [ad[0],  ad[17], ad[37].replace(/\+/g, '')];
			rows.push(row);
	});

	return rows;
}

module.exports = parseFromAdwords;
