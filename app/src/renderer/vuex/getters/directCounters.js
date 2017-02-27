export default (state, getters) => {
	const counters = {
		campaigns: 0,
		groups:    0,
		ads:       0,
		keywords:  0,
		fastLinks: 0
	}
	if (!getters.isDirectLoaded) return counters

	counters.campaigns += getters.directMap.length
	getters.directMap.forEach(campaign => {
		counters.groups += campaign.groups.length

		campaign.groups.forEach(group => {
			counters.ads += group.ads.length
			counters.keywords += group.keywords.length
			counters.fastLinks += group.fastLinks.length
		})
	})

	return counters
}
