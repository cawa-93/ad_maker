export default function findCampain (directMap, campain_name) {
	return directMap.find(c => c.name == campain_name);
}