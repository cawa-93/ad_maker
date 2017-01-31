const URL = require('url');

function isURL(string) {
	if (!string) return false;
	const data = URL.parse(string, true);

	return !!(data.protocol && data.host && data.path);
}

module.exports = isURL;
