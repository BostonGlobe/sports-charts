import { distanceBinSize, maxDistanceBin } from './config'
import zones from './zones'

function calculateDistance(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).toFixed(2)
}

function calculateDistanceBin(distance) {
	return Math.min(maxDistanceBin, Math.floor(distance / distanceBinSize))
}

function findZone(args) {
	return zones.filter(z => z.check(args))[0].name
}

export default function transform(data) {
	return data.map(datum => {
		const shotX = +datum['shot-x']
		const shotY = +datum['shot-y']
		const distance = +calculateDistance(shotX, shotY)
		const distanceBin = +calculateDistanceBin(distance)
		const zone = findZone({ shotX, shotY, distance })
		const made = datum.event.toLowerCase().indexOf('missed') < 0

		return { shotX, shotY, made, distance, distanceBin, zone }
	})
}
