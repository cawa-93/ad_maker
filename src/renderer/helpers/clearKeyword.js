export default function clearKeyword (str) {
	const regExpMap = [{
		reg: /^\[(.+)\]$/ig,
		replace: `"$1"`,
	}, {
		reg: /\+([^ ]+)/ig,
		replace: `$1`,
	}]

	let result = str

	regExpMap.forEach(({reg, replace}) => {
		result = result.replace(reg, replace)
	})

	return result
}
