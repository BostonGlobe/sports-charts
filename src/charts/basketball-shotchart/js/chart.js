import { scaleLinear, scaleOrdinal, scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'
import 'd3-transition'
import { easeQuadOut } from 'd3-ease'
import { hexbin } from 'd3-hexbin'
import { $, addClass, removeClass, hasClass } from '../../../utils/dom'
import colors from '../../../utils/colors'
import drawCourt from './drawCourt'

import {
	dimensions,
	binRatio,
	delayRange,
	transitionDuration,
	colorClasses,

} from './config'

const { left, right, top, bottom } = dimensions
const courtWidth = right - left
const courtHeight = bottom - top
const courtRatio = courtHeight / courtWidth
const hexbinner = hexbin()

const scales = {
	shotX: scaleLinear().domain([left, right]),
	shotY: scaleLinear().domain([top, bottom]),
	color: scaleQuantize().range(colorClasses),
	delay: scaleOrdinal().domain(colorClasses).range(delayRange),
}

const fills = {
	above: colors['celtics-team'],
	average: 'url(#pattern-average)',
	below: 'transparent',
	'below-threshold': 'transparent',
}

const binOffset = 0.5
let globalChartbuilder = false
let globalWidth = 280
let readyToResize = false
let globalRows = []

function getBinRadius() {
	return Math.floor(globalWidth * binRatio)
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
	const binRadius = getBinRadius() - 1
	const patternSize = Math.floor(binRadius / 2)

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
	const div = select('.key__bins')
	const svg = div.select('svg')
	const g = svg.select('.hex-group')

	const range = scales.color.range()
	const binRadius = getBinRadius() - 1
	const padding = binRadius * 2
	const height = binRadius * 3

	svg.attr('width', padding * 4).attr('height', height)
	g.attr('transform', `translate(${padding / 2},${height / 2})`)

	$('.key__before').style.lineHeight = `${height}px`
	$('.key__after').style.lineHeight = `${height}px`

	// bind range data to hexagons
	const hexagons = g.selectAll('.hexagon').data(range)

	// enter / update hexagons
	hexagons.enter()
		.append('path')
			.attr('class', d => `hexagon ${d} bin-radius-${binRadius}`)
			.style('fill', d => fills[d])
			.style('stroke', colors['celtics-team'])
			.attr('d', hexbinner.hexagon(0))
		.merge(hexagons)
		.attr('transform', (d, i) => `translate(${i * binRadius * 2 + binRadius}, 0)`)
		.attr('d', hexbinner.hexagon(binRadius))
}

// render hexagons to chart
function updateDOM() {
	const binRadius = getBinRadius() - binOffset

	$('.hexbin').innerHTML = ''
	// bind data and set key
	const hexagons = select('.hexbin')
		.selectAll('.hexagon')
		.data(globalRows, d => [d.x, d.y, { ...d }])

	hexagons.exit().remove()

	// create new hexagon paths
	const enterSelection = hexagons.enter()
		.append('path')
			.attr('class', 'hexagon')
			// .attr('d', d => createHexagon())
			.attr('d', hexbinner.hexagon(0))

	// position, color, and scale all hexagons
	enterSelection.merge(hexagons)
		.attr('transform', hex => `translate(${scales.shotX(hex.x)}, ${scales.shotY(hex.y)})`)
		.attr('class', hex => `${hex.category} bin-radius-${getBinRadius()}`)
		.style('fill', hex => fills[hex.category])
		.style('stroke', hex =>
			hex.category === 'below-threshold' ? 'transparent' : colors['celtics-team']
		)
		.transition()
			.duration(globalChartbuilder ? 0 : transitionDuration)
			.ease(easeQuadOut)
			.delay(hex => {
				if (hex.category === 'below-threshold') return 0
				return globalChartbuilder ? 0 : scales.delay(hex.category)
			})
			.attr('d', hexbinner.hexagon(binRadius))
}

// make averages global for resize computations and update bins
function updateData({ rows, isChartbuilder }) {
	// make it global so we can reuse on resize
	globalRows = rows.map(r => ({ x: +r.x, y: +r.y, category: r.category }))
	globalChartbuilder = isChartbuilder
	updateDOM()
}


// --- SETUP ---

// add containers to dom
function setupDOM() {
	const svg = select('.chart-container').select('svg')

	svg.append('g').attr('class', 'court')
	svg.append('g').attr('class', 'hexbin').attr('clip-path', 'url(#clip)')
	svg.append('g').attr('class', 'basket')

	svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
			.attr('class', 'mesh')
}

// setup dom for key
function setupKey() {
	select('.key__bins')
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
	if (readyToResize) {
		const width = globalWidth
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

		if (globalRows) updateDOM()
	}
}

function resizeEvent(width) {
	globalWidth = width
	handleResize()
}

// initialize chart
function setup() {
	setupDOM()
	setupKey()
	setupExplainer()

	// things we can do once we know width
	readyToResize = true
	handleResize()
	updateKey()
}

export default { setup, updateData, resizeEvent }
