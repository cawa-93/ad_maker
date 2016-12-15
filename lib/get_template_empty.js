function get_template_empty() {
    var cols = ['Кампания', "Группа", "Ключевая фраза"];
    for (let i = 1; i <= 4; i++) {
        cols = cols.concat([
            `Заголовок БС ${i}`,
            `URL БС ${i}`,
            `Описание БС ${i}`,
        ]);
    }
	return [cols];
}

module.exports = get_template_empty;
