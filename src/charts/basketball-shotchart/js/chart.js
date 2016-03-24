import { scaleLinear, scaleOrdinal, scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'
import 'd3-transition'
import { hexbin } from 'd3-hexbin'
import { $, addClass, removeClass, hasClass } from '../../../utils/dom'

import drawCourt from './drawCourt'
import getWeightedAverage from './getWeightedAverage'

import {
	dimensions,
	binRatio,
	delayRange,
	transitionDuration,
	percentRange,
	colorClasses,
	minShotsThreshold,
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
	delay: scaleOrdinal().domain(colorClasses).range(delayRange),
}

let windowWidth = 0

const data = {}

// --- HELPERS ---
function getBinRadius() {
	return Math.floor(windowWidth * binRatio)
}

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
	if (d.length > minShotsThreshold) {
		const made = getHexMade(d)
		const average = getWeightedAverage({ d, averages, date })
		const percent = +((made / d.length * 1000) / 10).toFixed(2)
		const diff = percent - average
		const color = scales.color(diff)
		return `${color} bin-radius-${getBinRadius()}`
	}

	return 'below-threshold'
}

// function stripLeadingZero()

// --- UPDATE ---

function updateSubhed(str) {
	if (str && str.length) {
		const year = +str.substring(0, 4)
		const month = +str.substring(4, 6) - 1
		const day = +str.substring(6, 8)

		const d = new Date(year, month, day)
		const dateString = d.toDateString()
		const split = dateString.split(' ')
		const output = `${split[1]}. ${+split[2]}`
		$('.subhed span').textContent = `through ${output}`
	}
}

// update scale ranges that deal with screen size
function updateScales({ width, height }) {
	scales.shotX.range([width, 0])
	scales.shotY.range([height, 0])
}

// responsive resize dom elements
function updateContainer({ width, height }) {
	select('.chart-container svg').attr('width', width).attr('height', height)
	select('#clip').select('rect').attr('width', width).attr('height', height)
}

function updatePattern() {
	$('.pattern-container').innerHTML = ''
	const binRadius = getBinRadius()
	const patternSize = Math.floor((binRadius - 1) / 2)

	const pattern = select('.pattern-container')
		.append('svg')
		.append('defs')
		.append('pattern')
			.attr('id', 'pattern-average')
			.attr('width', patternSize)
			.attr('height', patternSize)
			.attr('patternUnits', 'userSpaceOnUse')
			.attr('patternTransform', 'rotate(120)')

	pattern.append('rect')
		.attr('class', 'pattern-fill')
		.attr('width', 1)
		.attr('height', patternSize)
		.attr('transform', 'translate(0,0)')
}

function updateKey() {
	const div = select('.key-average')
	const svg = div.select('svg')
	const g = svg.select('.hex-group')

	const range = scales.color.range()
	const binRadius = getBinRadius()
	const sz = binRadius - 1
	const padding = sz * 2
	const height = sz * 3

	svg.attr('width', padding * 4).attr('height', height)
	g.attr('transform', `translate(${padding / 2},${height / 2})`)

	$('.key-container.average .before').style.lineHeight = `${height}px`
	$('.key-container.average .after').style.lineHeight = `${height}px`

	// bind range data to hexagons
	const hexagons = g.selectAll('.hexagon').data(range)

	// enter / update hexagons
	hexagons.enter()
		.append('path')
			.attr('class', d => `hexagon ${d} bin-radius-${binRadius}`)
			.attr('d', hexbinner.hexagon(0))
		.merge(hexagons)
		.attr('transform', (d, i) => `translate(${i * sz * 2 + sz}, 0)`)
		.attr('d', hexbinner.hexagon(sz))
}

function updateDOM({ hexbinData, averages, date }) {
	$('.hexbin').innerHTML = ''
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
			.duration(transitionDuration)
			.delay(d => {
				const className = getColor({ d, averages, date }).split(' ')[0]
				if (className === 'below-threshold') return 0
				return scales.delay(className)
			})
			.attr('d', hexbinner.hexagon(getBinRadius() - 1))
}

function plotAll(points) {
	select('.hexbin')
		.selectAll('circle')
		.data(points)
		.enter()
		.append('circle')
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		.attr('r', 2)
		.style('opacity', 0.5)
		.attr('class', d => d.made ? 'above' : 'below')
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

function updateBins({ averages, shots }) {
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

	// make updates
	updateDOM({ hexbinData, averages, date })
	// TODO remove
	// plotAll(points)
	return true
}

function updateData({ averages, shots }) {
	// make it global so we can reuse on resize
	data.shots = testFilter(shots) // TODO remove
	data.averages = averages
	updateBins(data)

	const date = getLatestDate(shots) 
	updateSubhed(date)
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
	select('.key-average')
		.append('svg').attr('width', 0).attr('height', 0)
			.append('g').attr('class', 'hex-group')
}

function setupExplainer() {
	$('.explainer a').addEventListener('click', e => {
		e.preventDefault()
		const p = $('.explainer p')
		const a = $('.explainer a')
		const hidden = hasClass(p, 'display-none')
		if (hidden) {
			removeClass(p, 'display-none')
			a.textContent = 'Close'
		} else {
			addClass(p, 'display-none')
			a.textContent = 'How is this chart calculated?'
		}
		return false
	})
}

function handleResize() {
	if (windowWidth !== window.innerWidth) {
		windowWidth = window.innerWidth

		const width = Math.floor($('.chart-container').offsetWidth)
		const height = Math.floor(width * courtRatio)

		updateContainer({ width, height })
		updatePattern()
		updateKey()

		hexbinner.size([width, height])
		hexbinner.radius(getBinRadius())

		updateScales({ width, height })
		const court = select('.court')
		const basket = select('.basket')

		// clear court
		$('.court').innerHTML = ''
		$('.basket').innerHTML = ''
		drawCourt({ court, basket, width, height })

		if (data.shots) updateBins(data)
	}
}

function setupResize() {
	window.addEventListener('resize', handleResize)
}

function setup() {
	setupDOM()
	setupScales()
	setupKey()
	setupExplainer()

	// things we can do once we know width
	handleResize()
	setupResize()
	updateKey()
}

export default { setup, updateData }
