var cli_menu = require('appendable-cli-menu');
function menu(text, options) {
    return new Promise((resolve, reject) => {
        var select = cli_menu(text, function (option) {
            resolve(option);
        });
        options.forEach(o => select.add(o));
    });
}

module.exports = menu;