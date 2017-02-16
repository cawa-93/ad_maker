export default function findGroup (campain, group_name) {
	return campain.groups.find(g => g.name == group_name);
}