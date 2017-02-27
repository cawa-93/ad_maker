export default
function campaignNamesSuffix (state, getters) {
	if (!getters.isDirectLoaded) return []

	return getters.directMap.reduce((suffix, {name}) => {
		if (!suffix.length) return []

		name = name.split('_')
		let suffixCounter = 0

		for (let i = suffix.length - 1, j = name.length - 1; i >= 0; i--, j--) {
			if (name[j] && suffix[i] === name[j]) {
				suffixCounter++
			} else {
				break
			}
		}

		return suffixCounter > 0 ? suffix.splice(-suffixCounter) : []
	}, getters.directMap[0].name.split('_'))
}
