function getWithoutQuotes (string) {
	var found = string.match(/"(.*)"/);
	return found ? found[1] : string;
}
module.exports = getWithoutQuotes;
