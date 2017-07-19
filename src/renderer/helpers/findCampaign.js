export default function findCampaign (directMap, campaignName) {
	return directMap.find(c => c.name === campaignName)
}
