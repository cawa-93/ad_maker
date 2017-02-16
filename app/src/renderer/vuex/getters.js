import libs from '../libs';

export const isDirectLoaded = state => !!state.direct.directLog.length && state.direct.currentDirectIndex > -1;
export const direct = state => state.direct.directLog[ state.direct.directLog.length - 1 ];

export const directMap = (state, getters) => {
	console.log('directMap started');
	const _map = [];
	getters.direct.forEach((row, index) => {
			if (index < 3 || !row || !row[8] || !row[3]) return;

			const campain_name = row[8];
			const group_name = row[3];
			const keyword = row[10];
			const ad = {
				title: row[12],
				desc: row[13],
				ancor: row[15],
				url: row[14],
			}

			const fastLinks = [];
			let fastLinksData = {
				titles: row[22].split('||'),
				urls: row[23].split('||'),
				descs: row[24].split('||'),
			}
			fastLinksData.urls.forEach((url, index) => {
				if (url && fastLinksData.titles[index] && fastLinksData.descs[index]) {
					fastLinks.push({
						title: fastLinksData.titles[index],
						url: url,
						desc:  fastLinksData.descs[index]
					})
				}
			});

			let campain = libs.findCampain(_map, campain_name);
			if (campain === undefined) {
				campain = {
					name: campain_name,
					groups: []
				};
				_map.push(campain)
			} 
			
			let group = libs.findGroup(campain, group_name);
			if (group === undefined) {
				group = {
					name: group_name,
					keywords: [],
					ads: [],
					fastLinks: [],
				};
				campain.groups.push(group)
			}

			group.ads.push(ad);
			if (keyword) group.keywords.push(keyword);
			if (Array.isArray(fastLinks) && fastLinks.length) group.fastLinks = fastLinks;
		})

		return _map;
}