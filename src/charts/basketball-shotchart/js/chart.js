import { scaleLinear, scaleQuantile, scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'
import { hexbin } from 'd3-hexbin'
import { $ } from '../../../utils/dom'
import jenks from './jenks'
import drawCourt from './drawCourt'

import { dimensions, binRatio, radiusRangeFactors, percentRange, colorClasses } from './config'

const { left, right, top, bottom } = dimensions
const courtWidth = right - left
const courtHeight = bottom - top
const courtRatio = courtHeight / courtWidth
const scales = {
	shotX: scaleLinear().domain([left, right]),
	shotY: scaleLinear().domain([top, bottom]),
	color: scaleQuantize().domain([-percentRange, percentRange]).range(colorClasses),
	radius: scaleQuantile(),
}
const hexbinner = hexbin()

function updateScales({ width, height, hexRadius }) {
	scales.shotX.range([width, 0])
	scales.shotY.range([height, 0])

	const radiusRange = radiusRangeFactors.map(f => f * hexRadius)
	scales.radius.range(radiusRange)
}

function updateContainer({ width, height }) {
	select('svg').attr('width', width).attr('height', height)
	select('#clip').select('rect').attr('width', width).attr('height', height)
}

function handleResize() {
	const width = Math.floor($('.chart-container').offsetWidth)
	const height = Math.floor(width * courtRatio)
	const hexRadius = Math.floor(width * binRatio)
	updateContainer({ width, height })
	hexbinner.size([width, height])
	hexbinner.radius(hexRadius)

	updateScales({ width, height, hexRadius })
	const court = select('.court')
	const basket = select('.basket')
	drawCourt({ court, basket, width, height })
}

function setup() {
	const svg = select('.chart-container').append('svg')

	svg.append('g').attr('class', 'court')
	svg.append('g').attr('class', 'hexbin')
	svg.append('g').attr('class', 'basket')

	svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
			.attr('class', 'mesh')

	handleResize()
}

function getHexMade(d) {
	return d.reduce((previous, current) => {
		const datum = current[2]
		const madeValue = datum.made ? 1 : 0
		const next = previous + madeValue
		return next
	}, 0)
}

function getWeightedAverage(d, averages, date) {
	// must combine averages since multiple zones might make up a bin
	const zoneDict = {}
	d.forEach(info => {
		const datum = info[2]
		if (zoneDict[datum.zone]) {
			zoneDict[datum.zone].count += 1
		} else {
			const zones = averages.filter(day => day.date === date)[0].zones
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
	// console.log(weightedZones, weightedAverage)
	return weightedAverage
}

function getLatestDate(shots) {
	const sorted = shots.sort((a, b) => (+a.gameDate) - (+b.gameDate))
	return sorted.pop().gameDate
}

// TODO remove
function testFilter(shots) {
	// console.log(data.shots[0])
	// data.shots = data.shots.filter(s => +s.quarter > 3)
	// shots = shots.filter(s => s.zone.indexOf('three') > -1)
	// data.shots = data.shots.filter(s => +s.quarter > 3)
	// data.shots = data.shots.filter(s => +s.zone.indexOf('three (right') > -1)
	// console.table(data.shots)
	// console.log(data.shots.length)
	return shots
}

function updateData({ averages, shots }) {
	shots = testFilter(shots)
	const latestDate = getLatestDate(shots)

	const points = shots.map(datum => ({
		...datum,
		x: scales.shotX(datum.shotX),
		y: scales.shotY(datum.shotY),
	}))

	const hexbinData = hexbinner(points.map(point =>
		[point.x, point.y, { ...point }]
	))

	const jenksData = hexbinData.map(d => d.length)
	const jenksDomain = jenks(jenksData, 3)
	scales.radius.domain(jenksDomain)

	const getColor = (d) => {
		const made = getHexMade(d)
		const average = getWeightedAverage(d, averages, latestDate)
		const percent = +((made / d.length * 1000) / 10).toFixed(2)
		const diff = percent - average
		const color = scales.color(diff)
		if (d.length > 0) return color
		return 'transparent'
		// return color
	}

	select('.hexbin')
		.attr('clip-path', 'url(#clip)')
		.selectAll('.hexagon')
		.data(hexbinData)
		.enter().append('path')
			.attr('class', 'hexagon')
			.attr('d', d => hexbinner.hexagon(scales.radius(d.length)))
			.attr('transform', d => `translate(${d.x}, ${d.y})`)
			.attr('class', d => getColor(d, latestDate))
}

export default { setup, updateData }
