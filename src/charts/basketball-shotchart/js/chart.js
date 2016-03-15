import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { hexbin } from 'd3-hexbin'
import { $ } from '../../../utils/dom'

import { dimensions, binRatio, minHexRadius } from './config'

const { left, right, top, bottom } = dimensions
const courtWidth = right - left
const courtHeight = bottom - top
const courtRatio = courtHeight / courtWidth
const scales = {
	shotX: scaleLinear().domain([left, right]),
	shotY: scaleLinear().domain([top, bottom]),
	color: scaleLinear().domain([-10, 10]).range(['white', 'green']),
	radius: scaleLinear(),
}

const hexbinner = hexbin()

function updateScales({ width, height, hexRadius }) {
	scales.shotX.range([0, width])
	scales.shotY.range([height, 0])
	scales.radius.range([minHexRadius, hexRadius])
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
		const datum = current[2]
		const madeValue = datum.made ? 1 : 0
		const next = previous + madeValue
		return next
	}, 0)
}

function getZonesByDate(averages, date) {
	return averages.filter(day => day.date === date)[0].zones
}

function getPercentFromZone(zones, zone) {
	return zones[zone].percent
}

function getWeightedAverage(d, averages, date) {
	// must combine averages since multiple zones might make up a bin
	const zonesWeighted = d.reduce((previous, current) => {
		const datum = current[2]
		if (previous[datum.zone]) {
			previous[datum.zone].count += 1
		}
		else {
			const zones = getZonesByDate(averages, date)
			const percent = getPercentFromZone(zones, datum.zone)
			const count = 1
			previous[datum.zone] = { count, percent } 
		}
		return previous
	}, {})

	let count = 0
	let total = 0
	for (var z in zonesWeighted) {
		count += zonesWeighted[z].count
		total += zonesWeighted[z].count * zonesWeighted[z].percent
	}

	return (total / count).toFixed()
}

function getLatestDate(shots) {
	const sorted = shots.sort((a, b) => (+b.gameDate) - (+a.gameDate))
	return sorted[0].gameDate
}

function updateData(data) {
	const latestDate = getLatestDate(data.shots)

	const points = data.shots.map(datum => ({
		...datum,
		x: scales.shotX(datum.shotX),
		y: scales.shotY(datum.shotY),
	}))

	const hexbinData = hexbinner(points.map(point => {
		return [point.x, point.y, { ...point }]
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
				const average = getWeightedAverage(d, data.averages, latestDate)
				const percent = +((made / d.length * 1000) / 10).toFixed(2)
				const diff = percent - average
				return scales.color(diff)
			})
			.style('stroke', 'none')
}

export default { setup, updateData }
