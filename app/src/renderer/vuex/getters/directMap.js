import libs from 'renderer/libs'

export default (state, getters) => {
	const _map = []
	if (!getters.direct) return _map
	getters.direct.forEach((row, index) => {
		if (index < 3 || !row || !row[9] || !row[3]) return

		const campaignName = row[9]
		const groupName = row[3]
		const keyword = row[11]
		const ad = {
			title: row[13],
			desc:  row[14],
			ancor: row[16],
			url:   row[15]
		}

		const fastLinks = []
		let fastLinksData = {
			titles: row[23].split('||'),
			urls:   row[24].split('||'),
			descs:  row[25].split('||')
		}
		fastLinksData.urls.forEach((url, index) => {
			if (url && fastLinksData.titles[index] && fastLinksData.descs[index]) {
				fastLinks.push({
					title: fastLinksData.titles[index],
					url:   url,
					desc:  fastLinksData.descs[index]
				})
			}
		})

		let campaign = libs.findCampaign(_map, campaignName)
		if (campaign === undefined) {
			campaign = {
				name:   campaignName,
				groups: []
			}
			_map.push(campaign)
		}

		let group = libs.findGroup(campaign, groupName)
		if (group === undefined) {
			group = {
				name:      groupName,
				keywords:  [],
				ads:       [],
				fastLinks: []
			}
			campaign.groups.push(group)
		}

		group.ads.push(ad)
		if (keyword) group.keywords.push(keyword)
		if (Array.isArray(fastLinks) && fastLinks.length) group.fastLinks = fastLinks
	})

	return _map
}
