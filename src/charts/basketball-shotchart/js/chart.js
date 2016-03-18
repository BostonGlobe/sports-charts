import { scaleLinear, scaleQuantile, scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'
import 'd3-transition'
import { hexbin } from 'd3-hexbin'
import { $ } from '../../../utils/dom'
import jenks from './jenks'
import drawCourt from './drawCourt'

import { dimensions, binRatio, radiusRangeFactors, delayRangeFactors, delayTime, percentRange, colorClasses } from './config'

const { left, right, top, bottom } = dimensions
const courtWidth = right - left
const courtHeight = bottom - top
const courtRatio = courtHeight / courtWidth
const scales = {
	shotX: scaleLinear().domain([left, right]),
	shotY: scaleLinear().domain([top, bottom]),
	color: scaleQuantize().domain([-percentRange, percentRange]).range(colorClasses),
	radius: scaleQuantile(),
	delay: scaleQuantile(),
}
const hexbinner = hexbin()

function updateScales({ width, height, hexRadius }) {
	scales.shotX.range([width, 0])
	scales.shotY.range([height, 0])

	const radiusRange = radiusRangeFactors.map(f => f * hexRadius)
	scales.radius.range(radiusRange)

	const delayRange = delayRangeFactors.map(f => f * delayTime)
	scales.delay.range(delayRange)
}

function updateContainer({ width, height }) {
	select('.chart-container svg').attr('width', width).attr('height', height)
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

function setupKey() {
	select('.key-frequency')
		.append('svg').attr('width', 0).attr('height', 0)
			.append('g')

	select('.key-average')
		.append('svg').attr('width', 0).attr('height', 0)
			.append('g')
}

function updateKeyFrequency(width) {
	// freq
	const freq = select('.key-frequency')
	const svg = freq.select('svg')
	const g = svg.select('g')

	const range = scales.radius.range()
	const max = range[range.length - 1]
	const padding = max * 2

	svg.attr('width', width).attr('height', padding * 2)
	g.attr('transform', `translate(${padding / 2},${padding})`)

	// bind range data to hexagons
	const hexagons = g.selectAll('.hexagon').data(range)

	// enter / update hexagons
	hexagons.enter()
		.append('path')
			.attr('class', 'hexagon')
			.attr('d', hexbinner.hexagon(0))
		.merge(hexagons)
		.attr('transform', (d, i) => `translate(${d * 2 + (i * d)}, 0)`)
		.attr('d', d => hexbinner.hexagon(d))

	// labels
	// g.select('.label-fewer').data([1])
	// 	.enter()
	// 	.append('text')
	// 	.text('fewer shots')

	// g.append('text')
	// 	.text('fewer shots')
		
}

function updateKeyAverage() {

}

function updateKey() {
	const width = Math.floor($('.chart-container').offsetWidth)
	updateKeyFrequency(width)
}

function setup() {
	const svg = select('.chart-container').append('svg')

	svg.append('g').attr('class', 'court')
	svg.append('g').attr('class', 'hexbin').attr('clip-path', 'url(#clip)')
	svg.append('g').attr('class', 'basket')

	svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
			.attr('class', 'mesh')

	setupKey()
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
			// console.log(datum)
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
	// shots = shots.filter(s => s.zone.indexOf('three') > -1)
	// shots = shots.filter(s => +s.quarter > 3)
	// shots = shots.filter(s => +s.zone.indexOf('three (right') > -1)
	// console.table(shots)
	// console.log(shots.length)
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
	const jenksDomain = jenks(jenksData, radiusRangeFactors.length - 1)
	scales.radius.domain(jenksDomain)
	scales.delay.domain(jenksDomain)
	updateKey()

	// jenksDomain.map(j => console.log(j, scales.radius(j)))

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

	const hexagons = select('.hexbin')
		.selectAll('.hexagon')
		.data(hexbinData, d => `${d.i}-${d.j}`)

	hexagons.exit()
		.remove()

	const enterSelection = hexagons.enter()
		.append('path')
			.attr('class', 'hexagon')
			.attr('d', hexbinner.hexagon(0))

	enterSelection.merge(hexagons)
		.attr('transform', d => `translate(${d.x}, ${d.y})`)
		.attr('class', d => getColor(d, latestDate))
		.transition()
			.duration(1500)
			.delay(d => scales.delay(d.length))
			.attr('d', d => hexbinner.hexagon(scales.radius(d.length)))


	// TODO remove test plot all points
	// select('.hexbin')
	// 	.selectAll('circle')
	// 	.data(points)
	// 	.enter()
	// 	.append('circle')
	// 	.attr('cx', d => d.x)
	// 	.attr('cy', d => d.y)
	// 	.attr('r', 2)
	// 	.style('opacity', 0.5)
	// 	.attr('class', d => d.made ? 'above' : 'below')
}

export default { setup, updateData }
