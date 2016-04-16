import { scaleLinear, scaleOrdinal, scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'
import 'd3-transition'
import { easeQuadOut } from 'd3-ease'
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

// global storage for data
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
// function getLatestDate(rows) {
// 	const sorted = rows.sort((a, b) => a.gameDateTime - b.gameDateTime)
// 	return sorted[sorted.length - 1].gameDateTime
// }

// calculate bin avg. vs. league avg. and return proper color
function getColor({ hex, averages }) {
	if (hex.length > minShotsThreshold) {
		const made = getHexMade(hex)
		const average = getWeightedAverage({ hex, averages })
		const percent = +((made / hex.length * 1000) / 10).toFixed(2)
		const diff = percent - average
		const color = scales.color(diff)
		return `${color} bin-radius-${getBinRadius()}`
	}

	return 'below-threshold'
}


// --- UPDATE ---

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

// create new stripe svg pattern for hex fills
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

// create chart key with matching size and fills
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

// render hexagons to chart
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
		.attr('transform', hex => `translate(${hex.x}, ${hex.y})`)
		.attr('class', hex => getColor({ hex, averages }))
		.transition()
			.duration(transitionDuration)
			.ease(easeQuadOut)
			.delay(hex => {
				const className = getColor({ hex, averages }).split(' ')[0]
				if (className === 'below-threshold') return 0
				return scales.delay(className)
			})
			.attr('d', hexbinner.hexagon(getBinRadius() - 1))
}

// compute new aggregation of points to bins
function updateBins({ averages, rows }) {

	// get x,y coords for each shot
	const points = rows.map(shot => ({
		...shot,
		x: scales.shotX(shot.shotX),
		y: scales.shotY(shot.shotY),
	}))

	// bin data into hexes
	const hexbinData = hexbinner(points.map(point =>
		[point.x, point.y, { ...point }]
	))

	// make updates
	updateDOM({ hexbinData, averages })
	return true
}

// make averages global for resize computations and update bins
function updateData(rows) {
	// make it global so we can reuse on resize
	data.averages = rows.filter(r => r._type === 'basketball-averages')
	data.rows = rows.filter(r => r._type === 'basketball-shotchart')
	updateBins(data)
}


// --- SETUP ---

// add containers to dom
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

// basic domain/range for scales
function setupScales() {
	scales.shotX.domain([left, right])
	scales.shotY.domain([top, bottom])
	scales.color
		.domain([-percentRange, percentRange])
		.range(colorClasses)
}

// setup dom for key
function setupKey() {
	select('.key-average')
		.append('svg').attr('width', 0).attr('height', 0)
			.append('g').attr('class', 'hex-group')
}

// setup event for toggling explainer text
function setupExplainer() {
	$('.chart-explainer a').addEventListener('click', e => {
		e.preventDefault()
		const p = $('.chart-explainer p')
		const a = $('.chart-explainer a')
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

// handle resize
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

		if (data.rows) updateBins(data)
	}
}

// listen for resize event
function setupResize() {
	window.addEventListener('resize', handleResize)
}

// initialize chart
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
