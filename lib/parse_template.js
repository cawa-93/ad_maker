const ParseTSV = require('./ParseTSV');

function parse_template (file_path) {
    return ParseTSV(file_path, 'utf8');
}

module.exports = parse_template;