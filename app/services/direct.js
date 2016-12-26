const getUrlWithUtm = require('../libs/getUrlWithUtm');
const getWithoutQuotes = require('../libs/getWithoutQuotes');
const slugify = require('transliteration').slugify;
slugify.config({ lowercase: false, separator: '_' });


module.exports = angular.module('main')
.service('directService', function () {
	let _data = [];

	this.setData = (data) => {
		_data = data;
		return this;
	}

	this.getData = () => {
		return _data;
	}

	this.setFastLinks = ([titles, urls, descs]) => {
		titles = `"${Object.keys(titles).map(k => titles[k]).join('||')}"`;
		urls = `"${Object.keys(urls).map(k => urls[k]).join('||')}"`;
		descs = `"${Object.keys(descs).map(k => descs[k]).join('||')}"`;

		_data = _data.map((ad, index) => {
			if (index < 3 || !ad) return ad;
			ad[22] = titles;
			ad[23] = urls;
			ad[24] = descs;
			return ad;
		})
		return this;
	}

	this.setUtm = (target, utm) => {
		switch (target) {
			case 'main': return this._setUtm_mainLinks(utm);
			case 'fast': return this._setUtm_fastLinks(utm);
			default: return this;
		}
	}

	this._setUtm_mainLinks = utm => {
		_data = _data.map((ad, index) => {
			if (index < 3 || !ad || !ad[14]) return ad;

			const utmForStep = {};
			for (key in utm) {
				utmForStep[key] = utm[key]
					.replace(/\$\{campaign_name\}/g, slugify(getWithoutQuotes(ad[8])))
					.replace(/\$\{group_name\}/g, slugify(getWithoutQuotes(ad[3])))
					.replace(/\$\{ad_title\}/g, slugify(getWithoutQuotes(ad[12])))
			}

			ad[14] = `"${getUrlWithUtm(getWithoutQuotes(ad[14]), utmForStep)}"`;
			return ad;
		});
		return this;
	}


	this._setUtm_fastLinks = utm => {
		_data = _data.map((ad, index) => {
			if (index < 3 || !ad || !ad[22] || !ad[23] || !ad[24]) return ad;

			const titles = getWithoutQuotes(ad[22]).split('||');
			const urls = getWithoutQuotes(ad[23]).split('||');
			const descs = getWithoutQuotes(ad[24]).split('||');

			for (let i = 0; i < 4; i++) {
				const utmForStep = {};
				for (key in utm) {
					utmForStep[key] = utm[key]
						.replace(/\$\{campaign_name\}/g, slugify(getWithoutQuotes(ad[8])))
						.replace(/\$\{group_name\}/g, slugify(getWithoutQuotes(ad[3])))
						.replace(/\$\{ad_title\}/g, slugify(getWithoutQuotes(ad[12])))
						.replace(/\$\{fastlink_name\}/g, slugify(titles[i]))
				}
				urls[i] = getUrlWithUtm(urls[i], utmForStep);
			}
			
			ad[23] = `"${urls.join('||')}"`;
			return ad;
		});
		return this;
	}

})

.name;
