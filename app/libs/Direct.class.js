const getUrlWithUtm = require('../libs/getUrlWithUtm');
const getWithoutQuotes = require('../libs/getWithoutQuotes');
const isURL = require('../libs/isURL');
const slugify = require('transliteration').slugify;
slugify.config({ lowercase: false, separator: '_' });

module.exports = class Direct {
	constructor() {
		this._backup = {data: null,map: null};
		this._data = [];
		this._map = [];
	}

	saveBackup () {
		this._backup.data = angular.copy(this._data);
		this._backup.map = angular.copy(this._map);
		return this;
	}

	restoreFromBackup () {
		this._data = angular.copy(this._backup.data);
		this._map = angular.copy(this._backup.map);
		return this;
	}

	setData (data) {
		this._data = data;
		this._generateMap();
		return this;
	}

	getData () {
		return this._data;
	}

	getMap () {
		return this._map;
	}

	/**
	 * Генерация карты кампаний
	 */
	_getCampain (camp_name) {
		return this._map.find(c => c.name == camp_name);
	}

	_getGroup (campain, group_name) {
		return this._map.find(g => g.name == group_name);
	}
	_generateMap () {
		this._map = [];
		this._data.forEach((row, index) => {
			if (index < 3 || !row || !row[8] || !row[3]) return;
			const campain_name = getWithoutQuotes(row[8]);
			const group_name = getWithoutQuotes(row[3]);
			const keyword = getWithoutQuotes(row[10]);
			const ad = {
				title: getWithoutQuotes(row[12]),
				desc: getWithoutQuotes(row[13]),
				ancor: getWithoutQuotes(row[15]),
				url: getWithoutQuotes(row[14]),
			}

			const fastLinks = [];
			let fastLinksData = {
				titles: getWithoutQuotes(row[22]).split('||'),
				urls: getWithoutQuotes(row[23]).split('||'),
				descs: getWithoutQuotes(row[24]).split('||'),
			}
			fastLinksData.urls.forEach((url, index) => {
				if (url && fastLinksData.titles[index] && fastLinksData.descs[index]) {
					fastLinks.push({
						title: fastLinksData.titles[index],
						url: url,
						desc:  fastLinksData.descs[index]
					})
				}
			});

			let campain = this._getCampain(campain_name);
			if (campain === undefined) {
				campain = {
					name: campain_name,
					groups: []
				};
				this._map.push(campain)
			} 
			
			let group = this._getGroup(campain, group_name);
			if (group === undefined) {
				group = {
					name: group_name,
					keywords: [],
					ads: [],
					fastLinks: [],
				};
				campain.groups.push(group)
			}

			group.ads.push(ad);
			if (keyword) group.keywords.push(keyword);
			if (angular.isArray(fastLinks) && fastLinks.length) group.fastLinks = fastLinks;
		})
	}

	/**
	 * Быстрые ссылки
	 */
	setFastLinks (template, templateType) {
		this.saveBackup();
		if (angular.isArray(template) && templateType) {
			this._setFastLinks_custom(template);
			this._generateMap();
		}
	}

	_setFastLinks_custom (template) {
		const map = {};

		this._data = this._data.map((ad, index) => {
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
			ad[23] = map[ad[8]][ad[3]].urls.toLowerCase();
			ad[24] = map[ad[8]][ad[3]].descs;

			return ad;
		});
		return this;
	}


	/**
	 * Пометка ссылок
	 */
	setUtm (target, utm) {
		this.saveBackup();
		switch (target) {
			case 'main': this._setUtm_mainLinks(utm); break;
			case 'fast': this._setUtm_fastLinks(utm); break;
		}
		this._generateMap();
	}

	_setUtm_mainLinks (utm) {
		this._data = this._data.map((ad, index) => {
			if (index < 3 || !ad || !ad[14]) return ad;

			const utmForStep = {};
			for (let key in utm) {
				utmForStep[key] = utm[key]
					.replace(/\$\{campaign_name\}/g, slugify(getWithoutQuotes(ad[8])))
					.replace(/\$\{group_name\}/g, slugify(getWithoutQuotes(ad[3])))
					.replace(/\$\{ad_title\}/g, slugify(getWithoutQuotes(ad[12])))
			}

			ad[14] = `"${getUrlWithUtm(getWithoutQuotes(ad[14]), utmForStep)}"`.toLowerCase();
			return ad;
		});
		return this;
	}


	_setUtm_fastLinks (utm) {
		this._data = this._data.map((ad, index) => {
			if (index < 3 || !ad || !ad[22] || !ad[23] || !ad[24]) return ad;

			const titles = getWithoutQuotes(ad[22]).split('||');
			const urls = getWithoutQuotes(ad[23]).split('||');
			const descs = getWithoutQuotes(ad[24]).split('||');

			for (let i = 0; i < 4; i++) {
				const utmForStep = {};
				for (let key in utm) {
					utmForStep[key] = utm[key]
						.replace(/\$\{campaign_name\}/g, slugify(getWithoutQuotes(ad[8])))
						.replace(/\$\{group_name\}/g, slugify(getWithoutQuotes(ad[3])))
						.replace(/\$\{ad_title\}/g, slugify(getWithoutQuotes(ad[12])))
						.replace(/\$\{fastlink_name\}/g, slugify(titles[i]))
				}
				urls[i] = getUrlWithUtm(urls[i], utmForStep);
			}
			
			ad[23] = `"${urls.join('||')}"`.toLowerCase();
			return ad;
		});
		return this;
	}


	/**
	 * Ключквые слова
	 */
	setKeywords (keywords) {
		this.saveBackup();
		keywords.forEach(([campain, group, keyword], i) => {
			let adIndex = this._data.findIndex(row => 
				row && row && row[8] && row[3]
				&& getWithoutQuotes(row[8]).toLowerCase() == campain.toLowerCase()
				&& getWithoutQuotes(row[3]).toLowerCase() == group.toLowerCase()
			);
			
			if (adIndex < 0) return;

			if (this._data[adIndex][10] != '') {
				let new_ad = angular.copy(this._data[adIndex]);
				new_ad[0] = `"-"`;
				this._data.splice(adIndex,0,new_ad);
				adIndex += 1;
			} else {
				this._data[adIndex][0] = `"-"`;
			}
			this._data[adIndex][10] = `"${keyword.trim()}"`;
		});
		this._generateMap();
	}
}