const ParseTSV = require('./ParseTSV');
const findIndex = require('./findIndex');
const getLink = require('./getLink');
const addUTM = require('./addUTM');
const slugify = require('transliteration').slugify;
const getWithoutQuotes = require('./getWithoutQuotes');
slugify.config({ lowercase: false, separator: '_' });

function get_direct (file_path, template) {
	return ParseTSV(file_path).then(ads => {

		// Вставляем ключевые фразы
		template.forEach((word, i) => {
			var index = findIndex(word, ads);
			if (i < 1 || index < 0) return;
			
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
			const links = getLink(ad, template);
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
		})
	})
}

module.exports = get_direct;