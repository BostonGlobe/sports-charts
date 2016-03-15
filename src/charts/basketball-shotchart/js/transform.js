import { distanceBinSize, maxDistanceBin } from './config'
import { zones } from './zones'
import getJSON from 'get-json-lite'

function calculateDistance(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).toFixed(2)
}

function calculateDistanceBin(distance) {
	return Math.min(maxDistanceBin, Math.floor(distance / distanceBinSize))
}

function findZone(args) {
	return zones.filter(z => z.check(args))[0].name
}

function loadAverageData(cb) {
	const url = '../../../test-data/basketball-shotchart-averages.json'
	getJSON(url, averageData => cb(null, averageData), cb(`error loading ${url}`, null))
}

export default function transform(data, cb) {
	loadAverageData((err, averages) => {
		if (err) cb(err)
		else {
			const shots = data.map(datum => {
				const shotX = +datum['shot-x']
				const shotY = +datum['shot-y']
				const distance = +calculateDistance(shotX, shotY)
				const distanceBin = +calculateDistanceBin(distance)
				const zone = findZone({ shotX, shotY, distance })
				const made = datum.event.toLowerCase().indexOf('missed') < 0

				return { shotX, shotY, made, distance, distanceBin, zone }
			})

			cb(null, { averages, shots })
		}
	})
}
