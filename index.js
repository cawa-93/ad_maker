#!/usr/bin/nodejs
var request = require('request');
const ParseTSV = require('./ParseTSV');
const StringifyTSV = require('./StringifyTSV');
const findIndex = require('./findIndex');
const config = require('./config');
const getLink = require('./getLink');
const addUTM = require('./addUTM');
const slugify = require('transliteration').slugify;
slugify.config({ lowercase: false, separator: '_' });

console.log('\nАнализ...');
Promise.all([ParseTSV(config.input.direct), ParseTSV(config.input.keywords)])


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
		//  [ 'Кампания', 'Группа', 'Слово' Заголовок 1	Ссылка 1	Описание 1	Заголовок 2	Ссылка 2	Описание 2	Заголовок 3	Ссылка 3	Описание 3	Заголовок 4	Ссылка 4	Описание 4],
		words.shift();
		var NotFound = [["Кампания", "Группа", "Фраза"]];

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

		const linksToTesting = [];
		ads.map(ad => {
			if (!ad || !ad[8]) return ad;


			if (ad[22] != '' || ad[23] != '' || ad[24] != '') return ad;

			// Пометка основных ссылок
			{
				let url = getWithoutQuotes(ad[14]);
				const utm = {
					utm_source: 'yandex',
					utm_medium: 'cpc',
					utm_campaign: slugify(ad[8]),
					utm_content: slugify(ad[3]),
				};
				url = addUTM(url, utm);
				ad[14] = `"${url}"`;
				linksToTesting.push(url);
			}


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

						let url = links[3*i+1];
						const utm = {
							utm_source: 'yandex',
							utm_medium: 'cpc',
							utm_campaign: slugify(ad[8]),
							utm_content: `bs_${slugify(links[3*i])}`,
						};
						url = addUTM(url, utm);
						urls.push(url);
						linksToTesting.push(url);
						
						descs.push(links[3*i+2]);
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

		ads_counter = {};
		ads.forEach(ad => {
			if (!ad || !ad[8]) return;
			if (!ads_counter[ad[8]]) ads_counter[ad[8]] = {};
			if (!ads_counter[ad[8]][ad[3]]) ads_counter[ad[8]][ad[3]] = 0;
			if (ad[10]) ads_counter[ad[8]][ad[3]] += 1;
		});

		ads_counter_TSV = [];
		for (var campain in ads_counter) {
			for (var group in ads_counter[campain]) {
				ads_counter_TSV.push([campain, group, ads_counter[campain][group]]);
			}
		}



		console.log(`\nСоздание файлов...`);

		return Promise.all([
			linksToTesting,
			StringifyTSV(config.output.direct, ads).then(() => console.log(`Файл "${config.output.direct}" создан.`)),
			StringifyTSV(config.output.keywords, NotFound).then(() => console.log(`Файл "${config.output.keywords}" создан.`)),
			StringifyTSV(config.output.counter, ads_counter_TSV).then(() => console.log(`Файл "${config.output.counter}" создан.`)),
		]);
	})

	.then(([urls]) => {
		var timeout = 250;
		var finishTime = new Date();
		finishTime = new Date(finishTime.getTime() + urls.length*timeout);
		console.log(`\nОбработка успешно завершена.`);
		console.log(`\nПроверка ссылок (${1000/timeout} url/sec)`);
		console.log(`Всего: ${urls.length}`);
		console.log(`Расчетное время завершения проверки ${finishTime.toLocaleTimeString()}`);
		console.log(`\nЧтобы завершить немедленно нажмите CTRL+C\n`);

		return Promise.all(urls.map((url, i) => getStatusCode(url, i*250).then((data) => {
			if (data[0] != 200) console.log(`${data[0]}:\t${data[1]}`);
			return data;
		})));
	})

	.then(statuses => {
		console.log(`\nВсе ссылки проверены`);
	})

	.catch(err => console.log(err));

function getWithoutQuotes (string) {
	var found = string.match(/"(.*)"/);
	return found ? found[1] : '';
}

function getStatusCode (url, timeout) {
	return new Promise(resolve => {
		setTimeout(function () {
			request(url, function (error, response, body) {
				resolve([response.statusCode, url]);
			});
		}, timeout);
	})
}
