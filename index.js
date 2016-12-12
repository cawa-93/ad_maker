const main = require('./inc/main.js');

if (module.parent) {
    module.exports = main;
} else {
    main({
        input: {
            direct: 'direct.csv',
            adwords: 'adwords.csv',
        },
        output: {
            direct: 'Result-Yandex-direct.txt',
            keywords: 'Not-found-keywords.txt',
        }
    }).then(() => {
        console.log(`\nОбработка успешно завершена.`);
    });
}