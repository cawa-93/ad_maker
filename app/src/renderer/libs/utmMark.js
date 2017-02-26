import URL from 'url'
import { slugify } from 'transliteration'
slugify.config({
	separator: '_',
	ignore:    ['.'],
	lowercase: true
})

export default function utmMark (baseUrl, utmParams, markAsAnchor = false) {
	if (!markAsAnchor) {
		let urlData = URL.parse(baseUrl, true)
		urlData.search = null

		for (let param in utmParams) {
			if (utmParams[param] !== '') urlData.query[param] = slugify(utmParams[param])
		}

		return URL.format(urlData)
	}

	let urlData = URL.parse('http://fake.url')
	urlData.search = null
	urlData.query = {}

	for (let param in utmParams) {
		if (utmParams[param] !== '') urlData.query[param] = slugify(utmParams[param])
	}
	const paramsString = URL.parse(URL.format(urlData)).query

	if (!paramsString) return baseUrl

	urlData = URL.parse(baseUrl)
	if (urlData.hash) urlData.hash += `&${paramsString}`
	else urlData.hash = `#${paramsString}`

	return URL.format(urlData)
}
