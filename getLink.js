function getLink(ad, map) {
	if (!ad || !ad[3]) return -1;
	var linkRow = map.find(word => {

		return word.every(col => col != '') 
			&& ad[8].toLowerCase() == `"${word[0]}"`.toLowerCase()
			&& ad[3].toLowerCase() == `"${word[1]}"`.toLowerCase()
	}
	);

	return linkRow;
}

module.exports = getLink;
