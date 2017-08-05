import {findCampaign, findGroup} from '@/helpers'

export function isLoaded (state) {
	return !!(Array.isArray(state.direct) && state.direct.length > 0)
}

export function directMap (state, getters) {
	// console.log('directMap', getters.isLoaded)
	const _map = []
	if (!getters.isLoaded) return _map
	const {CAMPAIN_NAME, GROUPE_NAME, KEYWORD, AD_TITLE, AD_TEXT, AD_URL, AD_ANCHOR, FS_TITLES, FS_URLS, FS_TEXTS} = state.columns

	state.direct.forEach((row, index) => {
		if (index < 3 || !row || !row[CAMPAIN_NAME] || !row[GROUPE_NAME]) return

		const campaignName = row[CAMPAIN_NAME]
		const groupName = row[GROUPE_NAME]
		const keyword = row[KEYWORD]
		const ad = {
			title: row[AD_TITLE],
			desc: row[AD_TEXT],
			ancor: row[AD_ANCHOR],
			url: row[AD_URL],
		}

		const fastLinks = []
		let fastLinksData = {
			titles: row[FS_TITLES].split('||'),
			urls: row[FS_URLS].split('||'),
			descs: row[FS_TEXTS].split('||'),
		}
		fastLinksData.urls.forEach((url, index) => {
			if (url && fastLinksData.titles[index] && fastLinksData.descs[index]) {
				fastLinks.push({
					title: fastLinksData.titles[index],
					url: url,
					desc: fastLinksData.descs[index],
				})
			}
		})

		let campaign = findCampaign(_map, campaignName)
		if (campaign === undefined) {
			campaign = {
				name: campaignName,
				groups: [],
			}
			_map.push(campaign)
		}

		let group = findGroup(campaign, groupName)
		if (group === undefined) {
			group = {
				name: groupName,
				keywords: [],
				ads: [],
				fastLinks: [],
			}
			campaign.groups.push(group)
		}

		group.ads.push(ad)
		if (keyword) group.keywords.push(keyword)
		if (Array.isArray(fastLinks) && fastLinks.length) group.fastLinks = fastLinks
	})

	return _map
}
