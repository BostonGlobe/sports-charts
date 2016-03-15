import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { hexbin } from 'd3-hexbin'
import { $ } from '../../../utils/dom'

import { dimensions, binRatio } from './config'

const { left, right, top, bottom } = dimensions
const courtWidth = right - left
const courtHeight = bottom - top
const courtRatio = courtHeight / courtWidth
const scales = {
	shotX: scaleLinear().domain([left, right]),
	shotY: scaleLinear().domain([top, bottom]),
	color: scaleLinear().range(['white', 'green']),
	radius: scaleLinear(),
}

const hexbinner = hexbin()

function updateScales({ width, height, hexRadius }) {
	scales.shotX.range([0, width])
	scales.shotY.range([height, 0])
	scales.radius.range([1, hexRadius])
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
}

function setup() {
	// create svg and containers for vis
	const svg = select('.chart-container').append('svg')
	svg.append('g').attr('hexbin-group')

	svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
			.attr('class', 'mesh')

	handleResize()
}

function getPercentMade(d) {
	return d.reduce((previous, current) => {
		const madeValue = current[2].made ? 1 : 0
		const next = previous + madeValue
		return next
	}, 0)
}

function updateData(data) {
	const points = data.shots.map(datum => ({
		...datum,
		x: scales.shotX(datum.shotX),
		y: scales.shotY(datum.shotY),
	}))

	const hexbinData = hexbinner(points.map(point => {
		const { made, shotX, shotY } = point
		return [point.x, point.y, { made, shotX, shotY }]
	}))

	const maxData = max(hexbinData, d => d.length)
	scales.radius.domain([1, maxData])

	select('svg').append('g')
		.attr('clip-path', 'url(#clip)')
		.selectAll('.hexagon')
		.data(hexbinData)
		.enter().append('path')
			.attr('class', 'hexagon')
			.attr('d', d => hexbinner.hexagon(scales.radius(d.length)))
			.attr('transform', d => `translate(${d.x}, ${d.y})`)
			.style('fill', d => {
				const made = getPercentMade(d)
				const percent = made / d.length
				return scales.color(percent)
			})
			.style('stroke', 'none')
}

export default { setup, updateData }
