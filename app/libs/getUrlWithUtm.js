const URL = require('url');

function getUrlWithUtm(url, utm) {
	var url_data = URL.parse(url, true);
	url_data.search = null;

	for (utm_field in utm) {
		if (utm[utm_field] !== '') url_data.query[utm_field] = utm[utm_field];
	}
	return URL.format(url_data);
}

module.exports = getUrlWithUtm;
