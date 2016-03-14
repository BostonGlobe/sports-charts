import { distanceBinSize } from './config'

function calculateDistance(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).toFixed(2)
}

function calculateDistanceBin(distance) {
	return Math.floor(distance / distanceBinSize)
}

function findZone({ shotX, shotY, distance }) {
	const zones = [
		{ name: 'paint (inside restricted area)', check: () =>
			distance < 4 &&
			shotY > -1.25
		},
		{ name: 'paint (outside restricted area)', check: () =>
			shotY <= 16.25 &&
			Math.abs(shotX) <= 8
		},
		{ name: 'mid range (left corner)', check: () =>
			shotX >= -22 &&
			shotX < -8 & 
			shotY < 8.75 
		},
		{ name: 'mid range (right corner)', check: () =>
			shotX > 8 &&
			shotX <= 22 & 
			shotY < 8.75 
		},
		{ name: 'mid range (left upper)', check: () =>
			shotX >= -22 &&
			shotX < -8 & 
			shotY >= 8.75 &&
			distance <= 23.75
		},
		{ name: 'mid range (right upper)', check: () =>
			shotX > 8 &&
			shotX <= 22 & 
			shotY >= 8.75 &&
			distance <= 23.75
		},
		{ name: 'mid range (middle upper)', check: () =>
			Math.abs(shotX) <= 8 &&
			shotY > 16.25 &&
			distance <= 23.75
		},
		{ name: 'three (left corner)', check: () =>
			shotX < -22 &&
			shotY < 8.75 
		},
		{ name: 'three (right corner)', check: () =>
			shotX > 22 &&
			shotY < 8.75
		},
		{ name: 'three (left)', check: () =>
			distance > 23.75 &&
			distance < 27.75 &&
			shotX < -8 &&
			shotY > 8.75
		},
		{ name: 'three (middle)', check: () =>
			distance > 23.75 &&
			distance < 27.75 &&
			Math.abs(shotX) <= 8 &&
			shotY > 8.75
		},
		{ name: 'three (right)', check: () =>
			distance > 23.75 &&
			distance < 27.75 &&
			shotX > 8 &&
			shotY > 8.75
		},
		{ name: 'three (deep)', check: () => true },
	]

	return zones.filter(z => z.check())[0].name
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
