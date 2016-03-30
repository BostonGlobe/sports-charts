import { scaleLinear, scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'
import 'd3-transition'
import { $ } from '../../../utils/dom'

import drawRink from './drawRink'

import {
	dimensions,
	shotRadius,
	transitionDuration,
	transitionDelay,
	missedOpacity,
} from './config'

const { left, right, top, bottom } = dimensions
const rinkWidth = bottom - top
const rinkHeight = right - left
const rinkRatio = rinkHeight / rinkWidth

const scales = {
	shotX: scaleLinear(),
	shotY: scaleLinear(),
	color: scaleQuantize(),
}

let windowWidth = 0

// global storage for data
const data = {}

// --- UPDATE ---

// update scale ranges that deal with screen size
function updateScales({ width, height }) {
	scales.shotX.range([height, 0])
	scales.shotY.range([0, width])
}

// responsive resize dom elements
function updateContainer({ width, height }) {
	select('.chart-container svg').attr('width', width).attr('height', height)
}

// create chart key with matching size and fills
function updateKey() {

}

// render hexagons to chart
function updateDOM(rows) {
	$('.shots').innerHTML = ''
	// bind data and set key
	const shots = select('.shots')
		.selectAll('.shot')
		.data(rows)

	shots.exit().remove()

	// create new a new circle
	const enterSelection = shots.enter()
		.append('circle')
			.attr('class', 'shot')

	// position, color, and scale all circles
	enterSelection.merge(shots)
		.attr('transform', d => {
			// confusing, I know.
			const y = scales.shotX(d.x)
			const x = scales.shotY(d.y)
			return `translate(${x}, ${y})`
		})
		.attr('r', shotRadius)
		.attr('cx', 0)
		.attr('cy', 0)
		.attr('class', d => {
			const className = d.made ? 'made' : 'missed'
			return `shot ${className}`
		})
		.style('opacity', 0)
		.transition()
			.duration(transitionDuration)
			.delay(d => d.made ? 0 : transitionDelay)
			.style('opacity', d => d.made ? 1 : missedOpacity)
}

// make averages global for resize computations and update bins
function updateData({ rows }) {
	// sort rows by made / missed for rendering ordering
	const sortedRows = rows.sort((a, b) => a.made - b.made)
	// make it global so we can reuse on resize
	data.rows = sortedRows
	updateDOM(sortedRows)
}


// --- SETUP ---

// add containers to dom
function setupDOM() {
	const svg = select('.chart-container').append('svg')

	svg.append('g').attr('class', 'rink')
	svg.append('g').attr('class', 'shots')
}

// basic domain/range for scales
function setupScales() {
	scales.shotX.domain([left, right])
	scales.shotY.domain([top, bottom])
}

// setup dom for key
function setupKey() {
	select('.key-average')
		.append('svg').attr('width', 0).attr('height', 0)
			.append('g').attr('class', 'hex-group')
}

// handle resize
function handleResize() {
	if (windowWidth !== window.innerWidth) {
		windowWidth = window.innerWidth

		const width = Math.floor($('.chart-container').offsetWidth)
		const height = Math.floor(width * rinkRatio)

		updateContainer({ width, height })
		// updateKey()

		updateScales({ width, height })
		const rink = select('.rink')

		// clear rink
		$('.rink').innerHTML = ''
		drawRink({ rink, width, height })

		if (data.rows) updateDOM(data.rows)
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
	// setupKey()

	// things we can do once we know width
	handleResize()
	setupResize()
	// updateKey()
}

export default { setup, updateData }
