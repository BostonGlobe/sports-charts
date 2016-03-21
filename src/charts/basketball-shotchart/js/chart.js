import { scaleLinear, scaleQuantile, scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'
import 'd3-transition'
import { hexbin } from 'd3-hexbin'
import { $ } from '../../../utils/dom'
import jenks from './jenks'

import drawCourt from './drawCourt'
import getWeightedAverage from './getWeightedAverage'

import {
	dimensions,
	binRatio,
	radiusRangeFactors,
	delayRangeFactors,
	delayTime,
	percentRange,
	colorClasses,
} from './config'

const { left, right, top, bottom } = dimensions
const courtWidth = right - left
const courtHeight = bottom - top
const courtRatio = courtHeight / courtWidth
const hexbinner = hexbin()

const scales = {
	shotX: scaleLinear(),
	shotY: scaleLinear(),
	color: scaleQuantize(),
	radius: scaleQuantile(),
	delay: scaleQuantile(),
}

// --- HELPERS ---

// how many shots were made in this hex bin
function getHexMade(d) {
	return d.reduce((previous, current) => {
		const datum = current[2]
		const madeValue = datum.made ? 1 : 0
		const next = previous + madeValue
		return next
	}, 0)
}

// extract the most recent date from all shots
function getLatestDate(shots) {
	const sorted = shots.sort((a, b) => (+a.gameDate) - (+b.gameDate))
	return sorted[sorted.length - 1].gameDate
}

// calculate bin avg. vs. league avg. and return proper color
function getColor({ d, averages, date }) {
	const made = getHexMade(d)
	const average = getWeightedAverage({ d, averages, date })
	const percent = +((made / d.length * 1000) / 10).toFixed(2)
	const diff = percent - average
	const color = scales.color(diff)
	if (d.length > 0) return color
	return 'transparent'
	// return color
}


// --- UPDATE ---

// update scale ranges that deal with screen size
function updateScales({ width, height, hexRadius }) {
	scales.shotX.range([width, 0])
	scales.shotY.range([height, 0])

	const radiusRange = radiusRangeFactors.map(f => f * hexRadius)
	scales.radius.range(radiusRange)

	const delayRange = delayRangeFactors.map(f => f * delayTime)
	scales.delay.range(delayRange)
}

// responsive resize dom elements
function updateContainer({ width, height }) {
	select('.chart-container svg').attr('width', width).attr('height', height)
	select('#clip').select('rect').attr('width', width).attr('height', height)
}

function updateKeyFrequency() {
	const div = select('.key-frequency')
	const svg = div.select('svg')
	const g = svg.select('.hex-group')
	const labelGroup = svg.select('.label-group')

	const range = scales.radius.range()
	const max = range[range.length - 1]
	const padding = max * 2

	svg.attr('width', padding * 4).attr('height', padding * 2)
	g.attr('transform', `translate(${padding / 2},${padding})`)

	$('.key-container .before').style.lineHeight = `${padding * 2}px`
	$('.key-container .after').style.lineHeight = `${padding * 2}px`
	// $('.key-container p').style.height = `${padding * 2}px`

	// labelGroup.attr('transform', `translate(0,${padding * 2})`)
	// labelGroup.select('.after')
	// 	.attr('transform', `translate(${padding * 2},${max / 2})`)

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
}

function updateKeyAverage(width) {
	const div = select('.key-average')
	const svg = div.select('svg')
	const g = svg.select('.hex-group')

	const range = scales.color.range()
	const radiusRange = scales.radius.range()
	const sz = radiusRange[radiusRange.length - 1]
	const padding = sz * 2

	svg.attr('width', width).attr('height', padding * 2)
	g.attr('transform', `translate(${padding / 2},${padding})`)

	// bind range data to hexagons
	const hexagons = g.selectAll('.hexagon').data(range)

	// enter / update hexagons
	hexagons.enter()
		.append('path')
			.attr('class', d => `hexagon ${d}`)
			.attr('d', hexbinner.hexagon(0))
		.merge(hexagons)
		.attr('transform', (d, i) => `translate(${(i * padding) + sz}, 0)`)
		.attr('d', hexbinner.hexagon(sz))
}

function updateKey() {
	const width = Math.floor($('.chart-container').offsetWidth)
	updateKeyFrequency(width)
	updateKeyAverage(width)
}

function updateDOM({ hexbinData, averages, date }) {
	// bind data and set key
	const hexagons = select('.hexbin')
		.selectAll('.hexagon')
		.data(hexbinData, d => `${d.i}-${d.j}`)

	hexagons.exit().remove()

	// create new hexagon paths
	const enterSelection = hexagons.enter()
		.append('path')
			.attr('class', 'hexagon')
			.attr('d', hexbinner.hexagon(0))

	// position, color, and scale all hexagons
	enterSelection.merge(hexagons)
		.attr('transform', d => `translate(${d.x}, ${d.y})`)
		.attr('class', d => getColor({ d, averages, date }))
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
	shots = testFilter(shots) // TODO remove
	const date = getLatestDate(shots)

	// get x,y coords for each shot
	const points = shots.map(shot => ({
		...shot,
		x: scales.shotX(shot.shotX),
		y: scales.shotY(shot.shotY),
	}))

	// bin data into hexes
	const hexbinData = hexbinner(points.map(point =>
		[point.x, point.y, { ...point }]
	))

	// create natural breaks for color scale
	const jenksData = hexbinData.map(d => d.length)
	const jenksDomain = jenks(jenksData, radiusRangeFactors.length - 1)

	// if we don't have a jenks domain it means there weren't enough data points
	if (!jenksDomain) return false

	scales.radius.domain(jenksDomain)
	scales.delay.domain(jenksDomain)

	// make updates
	updateKey()
	updateDOM({ hexbinData, averages, date })
	return true
}


// --- SETUP ---

function setupDOM() {
	const svg = select('.chart-container').append('svg')

	svg.append('g').attr('class', 'court')
	svg.append('g').attr('class', 'hexbin').attr('clip-path', 'url(#clip)')
	svg.append('g').attr('class', 'basket')

	svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
			.attr('class', 'mesh')
}

function setupScales() {
	scales.shotX.domain([left, right])
	scales.shotY.domain([top, bottom])
	scales.color
		.domain([-percentRange, percentRange])
		.range(colorClasses)
}

function setupKey() {
	setupKeyFrequency()

	select('.key-average')
		.append('svg').attr('width', 0).attr('height', 0)
			.append('g').attr('class', 'hex-group')
}

function setupKeyFrequency() {
	const svg = select('.key-frequency')
		.append('svg').attr('width', 0).attr('height', 0)

	svg.append('g').attr('class', 'hex-group')
	const labels = svg.append('g').attr('class', 'label-group')

	// labels.append('text')
	// 	.attr('class', 'before')
	// 	.text('Fewer shots')

	// labels.append('text')
	// 	.attr('class', 'after')
	// 	.text('More shots')
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
	setupDOM()
	setupScales()
	setupKey()
	handleResize()
}

export default { setup, updateData }
