export default (state, getters) => {
	const counters = {
		campains: 0,
		groups: 0,
		ads: 0,
		keywords: 0,
		fastLinks: 0
	}
	if (!getters.isDirectLoaded) return counters;
	
	counters.campains += getters.directMap.length;
	getters.directMap.forEach(campain => {
		counters.groups += campain.groups.length;

		campain.groups.forEach(group => {
			counters.ads       += group.ads.length;
			counters.keywords  += group.keywords.length;
			counters.fastLinks += group.fastLinks.length;
		});
	});

		return counters;
};
