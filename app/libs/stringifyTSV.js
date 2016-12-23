function stringifyTSV(data) {
	return data.map(row => row.join(`\t`)).join(`\n`);
}

module.exports = stringifyTSV;
