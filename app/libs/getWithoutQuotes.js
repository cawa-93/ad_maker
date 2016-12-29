function getWithoutQuotes (string) {
	if (!string) return string;
	var found = string.match(/"(.*)"/);
	return found ? found[1] : string;
}
module.exports = getWithoutQuotes;
