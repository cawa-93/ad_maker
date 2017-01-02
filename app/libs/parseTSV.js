function parseTSV(file_content) {
	return file_content.split('\n').map(r => r.split('\t'));
}

module.exports = parseTSV;
