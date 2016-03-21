export default function getWeightedAverage({ d, averages, date }) {
	// must combine averages since multiple zones might make up a bin
	const zoneDict = {}
	d.forEach(info => {
		const d = info[2]
		if (zoneDict[d.zone]) {
			zoneDict[d.zone].count += 1
		} else {
			const zones = averages.filter(day => day.date === date)[0].zones
			// console.log(d)
			const percent = zones[d.zone].percent
			const count = 1
			zoneDict[d.zone] = { count, percent }
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
