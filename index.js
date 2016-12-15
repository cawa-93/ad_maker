const menu = require('./lib/menu');

// if (module.parent) {
//     module.exports = main;
// } else {
//     const getConfig = require('./getConfig');

//     getConfig('adwords.txt', 'keywords.txt').then(config => {
//         return main(config);
//     }).then(() => {
//         console.log(`\nОбработка успешно завершена.`);
//     })
// }

menu('Что вы хотите сделать?', [
    {name: 'Создать шаблон', action: 'template'},
    {name: 'Заполнить файл Direct', action: 'direct'},
])

.then(({action}) => {
    switch (action) {
        case 'template' : 
            return menu('На основе чего создать шаблон?', [
                {name: 'Пустой шаблон', action: `${action}-empty`},
                {name: 'Взять данные из Adwords', action: `${action}-adwords`},
                {name: 'Взять данные из Direct', action: `${action}-direct`},
            ]);
        case 'direct' :
            return menu('Какими данными заполнить direct?', [
                {name: 'Взять данные из шаблона', action: `${action}-template`},
                {name: 'Взять данные из Adwords', action: `${action}-adwords`},
            ]);
    }
})

.then(({action}) => {
    if (action === 'template-empty') {
        return {action: action};
    }
    const fs = require('fs');
    const [action_name, action_type] = action.split('-');
    let options = fs.readdirSync('./').filter(file => !fs.statSync(file).isDirectory()).map(file => ({name: file, action: action}));

    if (action_name === 'template') {
        return menu(`Выберите файл ${action_type.toUpperCase()} из которого будут прочитаны данные`, options);
    } else {
       return menu(`Выберите файл ${action_name.toUpperCase()} который будет заполнен`, options)
            .then(({name: file, action: action}) => {
                options = options.map(o => {o.direct = file; return o});
                return menu(`Выберите файл ${(action_type == 'template' ? 'Шаблона' : action_type).toUpperCase()} из которого будут прочитаны данные`, options)
            });
    }
})

.then(({name: file, action: action, direct: direct}) => {
    const get_template_empty = require('./lib/get_template_empty');
    const get_template_adwords = require('./lib/get_template_adwords');
    const get_template_direct = require('./lib/get_template_direct');
    const parse_template = require('./lib/parse_template');
    const get_direct = require('./lib/get_direct');
    const [action_name, action_type] = action.split('-');

    switch(action) {
        case 'template-empty' :
            return ['template-empty.txt', get_template_empty()];
        
        case 'template-adwords' : 
             return get_template_adwords(file).then(template => [action+'.txt', template]);
        
        case 'template-direct' : 
            return get_template_direct(file).then(template => [action+'.txt', template]);
        
        case 'direct-template' : 
            return parse_template(file).then(template => get_direct(direct, template)
                .then(direct_template => [`RESULT-${direct}.txt`, direct_template]));
        
        case 'direct-adwords' : 
            return get_template_adwords(file).then(template => get_direct(direct, template)
                .then(direct_template => [`RESULT-${direct}.txt`, direct_template]));
        
        default : 
         return Promise.reject('Не существующий сценарий');
    }
})

.then((data) => {
    if (!data[0] || !data[1]) return Promise.reject(data);

    console.log('WRITE TO FILE');
    console.log(data[0]);
    const StringifyTSV = require('./lib/StringifyTSV');
    return StringifyTSV(data[0], data[1]);
})

.catch(err => console.log(err))
;