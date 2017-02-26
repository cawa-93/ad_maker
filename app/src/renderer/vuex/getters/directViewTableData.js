export default
function directViewTableData (state, getters) {
	if (!getters.isDirectLoaded) return []

	return getters.directMap.reduce((tableData, campain) => {
		campain.groups.forEach(group => {
			group.ads.forEach(ad => {
				tableData.push({
					campain:  campain.name,
					group:    group.name,
					ad_title: ad.title,
					ad_desc:  ad.desc,
					ad_ancor: ad.ancor,
					ad_url:   ad.url
				})
			})
			group.keywords.forEach(keyword => {
				tableData.push({
					campain: campain.name,
					group:   group.name,
					keyword
				})
			})
			group.fastLinks.forEach(link => {
				tableData.push({
					campain:        campain.name,
					group:          group.name,
					fastLink_title: link.title,
					fastLink_url:   link.url,
					fastLink_desc:  link.desc
				})
			})
		})
		return tableData
	}, [])
}
