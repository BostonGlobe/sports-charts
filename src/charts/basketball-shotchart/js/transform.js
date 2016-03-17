import { getZoneFromShot } from 'nba-shot-zones'
import getJSON from 'get-json-lite'

function calculateDistance(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)).toFixed(2)
}

function loadAverageData(cb) {
	const url = '../../../test-data/basketball-shotchart-averages-zones.json'
	getJSON(url, cb)
}

function getZoneGroup(zone) {
	return zone
}

export default function transform(data, cb) {
	loadAverageData((err, averages) => {
		if (err) cb(err)
		else {
			// season, gamedate, opponent, home-away, event, quarter, time, player, shot-x, shot-y
			const shots = data.map(datum => {
				const season = datum.season
				const gameDate = datum.gamedate
				const opponent = datum.opponent
				const home = datum['home-away'] === 'home'
				const quarter = +datum.quarter
				const time = datum.time
				const player = datum.player
				const shotX = +datum['shot-x']
				const shotY = +datum['shot-y']

				const distance = +calculateDistance(shotX, shotY)
				const zone = getZoneFromShot({ x: shotX, y: shotY })
				const zoneGroup = getZoneGroup(zone)
				const made = datum.event.toLowerCase().indexOf('missed') < 0

				return {
					season,
					gameDate,
					opponent,
					home,
					quarter,
					time,
					player,
					shotX,
					shotY,
					made,
					distance,
					zone,
					zoneGroup,
				}
			})

			cb(null, { averages, shots })
		}
	})
}
