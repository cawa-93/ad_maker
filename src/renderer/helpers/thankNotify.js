import { shell } from 'electron'
import declOfNum from 'common/declOfNum'

export default function thankNotify (seconds) {
	let count = 0
	let cases 
	if (seconds >= 3600) {
		count = Math.round(seconds / 3600)
		cases = ['час', 'часа', 'часов']
	} else if (seconds >= 60) {
		count = Math.round(seconds / 60)
		cases = ['минуту', 'минуты', 'минут']
	} else {
		count = Math.round(seconds)
		cases = ['сукунду', 'секунды', 'секунд']
	}

	const notification = new Notification(`Вы сэкономили ${count} ${declOfNum(cases)(count)}`, {
		body: 'Потратьте это время с пользой'
	})
	notification.onclick = () => shell.openExternal('https://www.liqpay.ua/ru/checkout/kozack')
}