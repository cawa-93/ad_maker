function findIndex(word, map) {
	if (!word || word[0] == '') return -1;
 return map.findIndex(ad => ad[8] && ad[3] && ad[8].toLowerCase() == `"${word[0]}"`.toLowerCase() && ad[3].toLowerCase() == `"${word[1]}"`.toLowerCase());
}

module.exports = findIndex;
