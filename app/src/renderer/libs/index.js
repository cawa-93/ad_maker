const files = require.context('.', false, /\.js$/)
const libs = {}

files.keys().forEach((key) => {
	if (key === './index.js') return
	libs[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default libs
