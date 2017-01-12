const getUrlWithUtm = require('../libs/getUrlWithUtm');
const getWithoutQuotes = require('../libs/getWithoutQuotes');
const isURL = require('../libs/isURL');
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

	this.setFastLinks = (template, templateType) => {
		if (angular.isArray(template) && templateType) {
			return this._setFastLinks_custom(template);
		}

		// titles = `"${Object.keys(titles).map(k => titles[k]).join('||')}"`;
		// urls = `"${Object.keys(urls).map(k => urls[k]).join('||')}"`;
		// descs = `"${Object.keys(descs).map(k => descs[k]).join('||')}"`;

		// _data = _data.map((ad, index) => {
		// 	if (index < 3 || !ad) return ad;
		// 	ad[22] = titles;
		// 	ad[23] = urls;
		// 	ad[24] = descs;
		// 	return ad;
		// })
		// return this;
	}

	this._setFastLinks_custom = (template) => {
		const map = {};

		_data = _data.map((ad, index) => {
			if (index < 3 || !ad || !angular.isArray(ad) || !ad[8] || !ad[3]) return ad;

			if (!map[ad[8]] || !map[ad[8]][ad[3]]) {
				let linksRow = template.find(([campain, group,/*keyword*/,/*title*/, url]) => 
					campain && group && url
					        && getWithoutQuotes(ad[8]).toLowerCase() == campain.toLowerCase()
					        && getWithoutQuotes(ad[3]).toLowerCase() == group.toLowerCase()
				);
				if (!linksRow) return ad;

				[/*campain*/, /*group*/,/*keyword*/, ...linksRow] = linksRow;
				let titles = [];
				let urls = [];
				let descs = [];
				
				linksRow.forEach((linkItem, i) => {
					if (!linkItem) return;
					if (isURL(linksRow[i+1])) titles.push(linkItem);
					else if (isURL(linkItem)) urls.push(linkItem);
					else if (isURL(linksRow[i-1])) descs.push(linkItem);
					else descs[descs.length-1] += ` ${linkItem}`;
				});

				if(!map[ad[8]]) map[ad[8]] = {};
				if(!map[ad[8]][ad[3]]) map[ad[8]][ad[3]] = {
					titles: `"${titles.join('||')}"`,
					urls: `"${urls.join('||')}"`,
					descs: `"${descs.join('||')}"`,
				};
			}

			ad[22] = map[ad[8]][ad[3]].titles;
			ad[23] = map[ad[8]][ad[3]].urls;
			ad[24] = map[ad[8]][ad[3]].descs;

			return ad;
		});
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

	this.setKeywords = (keywords) => {
		keywords.forEach(([campain, group, keyword], i) => {
			let adIndex = _data.findIndex(row => row && row && row[8] && row[3]
			                                         && getWithoutQuotes(row[8]).toLowerCase() == campain.toLowerCase()
			                                         && getWithoutQuotes(row[3]).toLowerCase() == group.toLowerCase()
			);
			if (adIndex < 0) return;

			if (_data[adIndex][10] != '') {
				let new_ad = angular.copy(_data[adIndex]);
				new_ad[0] = `"-"`;
				_data.splice(adIndex,0,new_ad);
				adIndex += 1;
			} else {
				_data[adIndex][0] = `"-"`;
			}
			_data[adIndex][10] = `"${keyword}"`;
		});
	}
})

.name;
