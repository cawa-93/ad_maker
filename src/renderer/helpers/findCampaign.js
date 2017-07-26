export default function findCampaign (map, campaignName) {
	return map.find(c => c.name === campaignName)
}
