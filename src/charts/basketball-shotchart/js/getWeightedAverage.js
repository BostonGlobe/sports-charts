export default function getWeightedAverage({ hex, averages }) {

	// must combine averages since multiple zones might make up a bin
	const zoneDict = {}
	hex.forEach(h => {
		const datum = h[2]
		if (zoneDict[datum.zone]) {
			zoneDict[datum.zone].count += 1
		} else {
			// sort desc by gameDate and return first
			const sorted = averages.sort((a, b) => b.gameDate - a.gameDate)
			const zones = sorted[0].zones
			const percent = zones[datum.zone].percent
			const count = 1
			zoneDict[datum.zone] = { count, percent }
		}
	})

	const zones = Object.keys(zoneDict)
	const weightedZones = zones.map(zone => ({ zone, values: zoneDict[zone] }))

	const count = weightedZones.reduce((sum, z) => sum + z.values.count, 0)
	const sumPercents = weightedZones.reduce((sum, z) =>
		sum + z.values.count * z.values.percent
	, 0)

	const weightedAverage = +(sumPercents / count).toFixed(2)
	return weightedAverage
}
