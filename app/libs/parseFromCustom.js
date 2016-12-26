function parseFromCustom(data) {
	const keywords = data.filter((row, i) => i > 0 && row[0] && row[1] && row[2]);
	const rows = [];
	keywords.forEach((ad, i) => {
			let row = [ad[0],  ad[1], ad[2].replace(/\+/g, '')];
			rows.push(row);
	});

	return rows;
}

module.exports = parseFromCustom;
