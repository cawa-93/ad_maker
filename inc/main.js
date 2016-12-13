#!/usr/bin/nodejs
var request = require('request');
const ParseTSV = require('./ParseTSV');
const StringifyTSV = require('./StringifyTSV');
const findIndex = require('./findIndex');
const getLink = require('./getLink');
const addUTM = require('./addUTM');
const slugify = require('transliteration').slugify;
slugify.config({ lowercase: false, separator: '_' });

function main (config) {

	console.log('\nАнализ Adwords');
	return ParseTSV(config.input.adwords).then(data => {

		const results = [];
		const keywords = data.filter((row, i) => {
			return i > 0 && row[0] && row[17] && row[37];
		});

		const links = data.filter(row => {
			return row[0] && row[17] && row[43] && row[46] && row[47] && row[48];
		});
		keywords.forEach((ad, i) => {

			if (ad[0] && ad[17] && ad[37]) {
				let result = [ad[0],  ad[17], ad[37]];
				let currentLinks = [];
				let removedIndex = [];
				for (var i = links.length - 1; i >= 0; i--) {
					if (links[i][0] === ad[0] && links[i][17] === ad[17] && links[i][43] && links[i][46] && links[i][47] && links[i][48]) {
						currentLinks.push(links[i]);
						removedIndex.push(i);
					}

					if (currentLinks.length === 4) {
						removedIndex.forEach(i => links.splice(i,1));
						break;
					}
				}
				currentLinks.forEach(row => {
					result = result.concat([row[46], row[43].replace(/\+/g, ''), `${row[47]} ${row[48]}`]);
				});
				results.push(result);
			}
		});
		console.log('\nАнализ Direct');
		return Promise.all([ParseTSV(config.input.direct), results]);
	})
		.then(([ads, words]) => {
			/* 
			0 	Доп. объявление группы
			1 	Мобильное объявление
			2 	ID группы
			3 	Название группы
			4 	Номер группы
			5 	Тип кампании		
			6 	ID кампании (локальный)
			7 	ID кампании (серверный)
			8 	Название кампании
			9 	ID фразы
			10	Фраза (с минус-словами)
			11	ID объявления
			12	Заголовок
			13	Текст
			14	Ссылка
			15	Отображаемая ссылка
			16	Регион
			17	Ставка
			18	Ставка в сетях
			19	Контакты
			20	Статус объявления
			21	Статус фразы
			22	Заголовки быстрых ссылок
			23	Адреса быстрых ссылок
			24	Описания быстрых ссылок
			25	Параметр 1
			26	Параметр 2
			27	Метки
			28	Изображение
			29	Уточнения
			30	Минус-слова на группу
			31	Минус-слова на кампанию
			32	Возрастные ограничения
			33	Ссылка на приложение в магазине
			34	Тип устройства
			35	Тип связи
			36	Версия ОС
			37	Трекинговая ссылка
			38	Иконка
			39	Рейтинг
			40	Количество оценок
			41	Цена
			*/

			console.log('Копирование данных');

			var NotFound = [];
			words.forEach(word => {
				var index = findIndex(word, ads);
				if (index < 0) {
					NotFound.push(word);
					return;
				}

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

			ads.map(ad => {
				if (!ad || !ad[8]) return ad;

				// Пометка основных ссылок
				{
					let url = ad[14];
					const utm = {
						utm_source: 'yandex',
						utm_medium: 'cpc',
						utm_campaign: slugify(ad[8]),
						utm_content: slugify(ad[3]),
					};
					url = addUTM(url, utm);
					ad[14] = `"${url}"`;
				}


				if (ad[22] != '' || ad[23] != '' || ad[24] != '') return ad;
				// Генерация быстрых ссылок
				{
					const links = getLink(ad, words);
					if (!links) return ad;
					const titles = [];
					const urls = [];
					const descs = [];

					for (var i = 1; i < 5; i++) {
						if (links[3*i] && links[3*i+1] && links[3*i+2]) {
							titles.push(links[3*i]);
							descs.push(links[3*i+2]);

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
				}
			});

			console.log(`\nСоздание файлов...`);

			return Promise.all([
				StringifyTSV(config.output.direct, ads).then(() => console.log(`Файл "${config.output.direct}" создан.`)),
				StringifyTSV(config.output.keywords, NotFound).then(() => console.log(`Файл "${config.output.keywords}" создан.`)),
			]);
		})

		.catch(err => console.log(err));
}

module.exports = main;