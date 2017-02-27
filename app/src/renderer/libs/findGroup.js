export default function findGroup (campaign, groupName) {
	return campaign.groups.find(g => g.name === groupName)
}
