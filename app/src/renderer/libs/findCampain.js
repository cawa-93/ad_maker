export default function findCampain (directMap, campainName) {
	return directMap.find(c => c.name === campainName)
}
