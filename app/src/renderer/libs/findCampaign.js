export default function findcampaign (directMap, campaignName) {
	return directMap.find(c => c.name === campaignName)
}

