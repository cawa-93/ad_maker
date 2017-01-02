const getWithoutQuotes = require('./getWithoutQuotes');
function getLink(ad, template) {
	if (!ad || !ad[3]) return undefined;

	var linkRow = template.find(word => {
		return getWithoutQuotes(ad[8]).toLowerCase() == word[0].toLowerCase()
			&& getWithoutQuotes(ad[3]).toLowerCase() == word[1].toLowerCase()
	}
	);
	// console.log(linkRow)
	return linkRow;
}

module.exports = getLink;
