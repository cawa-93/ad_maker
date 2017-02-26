export default function findGroup (campain, groupName) {
	return campain.groups.find(g => g.name === groupName)
}
