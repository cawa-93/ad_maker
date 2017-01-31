const getWithoutQuotes = require('./getWithoutQuotes');
const findIndex = require('./findIndex');
const getLink = require('./getLink');
const addUTM = require('./addUTM');
const slugify = require('transliteration').slugify;
slugify.config({ lowercase: false, separator: '_' });

class Template {
	constructor (data, data_type = 'custom') {
		this.data_type = data_type;

		switch (data_type) {
			case 'custom' : this.data = this._parseCustom(data); break;
			case 'adwords' : this.data = this._parseAdwords(data); break;
			case 'direct' : this.data = this._parseDirect(data); break;
		}
	}

	_parseCustom(data) {
		return data.slice(1);
	}

	_parseAdwords(data) {
		const keywords = data.filter((row, i) => i > 0 && row[0] && row[17] && row[37]);
		const links = data.filter((row, i) => i > 0 && row[0] && row[17] && row[43] && row[46] && row[47] && row[48]);
		const rows = [];
		keywords.forEach((ad, i) => {

			if (ad[0] && ad[17] && ad[37]) {
				let row = [ad[0],  ad[17], ad[37].replace(/\+/g, '')];
				let currentLinks = [];
				for (var i = 0; i < links.length; i++) {
					if (links[i][0] === ad[0] && links[i][17] === ad[17] && links[i][43] && links[i][46] && links[i][47] && links[i][48]) {
							currentLinks.push(links[i]);
					}

					if (currentLinks.length === 4) {
							break;
					}
				}
				currentLinks.forEach(link => {
						row = row.concat([link[46], link[43], `${link[47]} ${link[48]}`]);
				});
				rows.push(row);
			}
		});

		return rows;
	}

	_parseDirect(data) {
		const rows = [];

		data.forEach((row, i) => {
			if (i < 3 || !row[8] || !row[3] || !row[10] || !row[22] || !row[23] || !row[24]) return;
			var result = [
					getWithoutQuotes(row[8]),  // Campain
					getWithoutQuotes(row[3]),  // Group
					getWithoutQuotes(row[10]), // keyword
					// row[22],
					// row[23],
					// row[24],
			];
			var titles = getWithoutQuotes(row[22]).split('||');
			var urls = getWithoutQuotes(row[23]).split('||');
			var descs = getWithoutQuotes(row[24]).split('||');
			urls.forEach((url, i) => {
					result = result.concat([titles[i], url, descs[i]]);
			});

			rows.push(result);
		});

		return rows;
	}

	stat () {
		const stat = {
			campain: new Set(),
			groups: new Set(),
			keywords: new Set(),
		}
		this.data.forEach(row => {
			if (row && row.length && row[0] && row[1] && row[2]) {
				stat.campain.add(row[0]);
				stat.groups.add(`${row[0]}_${row[1]}`);
				stat.keywords.add(`${row[0]}_${row[1]}_${row[2]}`);
			}
		});
		return stat;
	}
	generateDirect(ads) {
		// Вставляем ключевые фразы
		this.data.forEach((word, i) => {
			var index = findIndex(word, ads);
			if (index < 0) return;
			
			if (ads[index][10] != '') {
				var new_ad = ads[index].slice(0, ads[index].length);
				index += 1;
				new_ad[0] = `"-"`;
				ads.splice(index,0,new_ad);
			} else {
				ads[index][0] = `"-"`;
			}
			ads[index][10] = `"${word[2]}"`;
		});
		
		return ads.map((ad, i) => {
			if (i < 3 || !ad || !ad[8]) return ad;

			// Пометка основных ссылок
			let url = getWithoutQuotes(ad[14]);
			const utm = {
				utm_source: 'yandex',
				utm_medium: 'cpc',
				utm_campaign: slugify(ad[8]),
				utm_content: slugify(ad[3]),
			};
			url = addUTM(url, utm);
			ad[14] = `"${url}"`;

			// Генерация быстрых ссылок
			if (ad[22] != '' || ad[23] != '' || ad[24] != '') return ad;
			const links = getLink(ad, this.data);
			if (!links) return ad;
			const titles = [];
			const urls = [];
			const descs = [];

			for (var i = 1; i < 5; i++) {
				if (links[3*i] && links[3*i+1] && links[3*i+2]) {
					titles.push(links[3*i]);
					descs.push(links[3*i+2]);

					// Пометка быстрых ссылок
					let url = links[3*i+1];
					const utm = {
						utm_source: 'yandex',
						utm_medium: 'cpc',
						utm_campaign: slugify(ad[8]),
						utm_content: `bs_${slugify(links[3*i])}`,
					};
					url = addUTM(url, utm);
					urls.push(url);					
				} else {
					console.log(`Не удалось создать ссылку в объявлении`);
					console.log(ad);
				}
			}
			// Заголовки
			ad[22] = `"${titles.join('||')}"`;
			// Ссылки
			ad[23] = `"${urls.join('||')}"`;
			// Описания
			ad[24] = `"${descs.join('||')}"`;

			return ad;
		});
	}
}

module.exports = Template;
