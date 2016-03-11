import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { hexbin } from 'd3-hexbin'

import { dimensions, binRatio } from './config'

const { left, right, top, bottom } = dimensions
const courtWidth = right - left
const courtHeight = bottom - top
const scales = {
	shotX: scaleLinear().domain([left, right]),
	shotY: scaleLinear().domain([top, bottom]),
	color: scaleLinear().range(['white', 'green']),
	radius: scaleLinear(),
}

const hexbinner = hexbin()

function setup() {
	// create svg and containers for vis
	const svg = select('.chart-container').append('svg')
	svg.append('g').attr('hexbin-group')

	svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
			.attr('class', 'mesh')
}

function updateScales() {
	scales.color.domain([0.15, .7])
	scales.radius.domain([1, maxRadius])
}

function updateContainer() {
	const width = Math.floor(select('.chart-container')[0].offsetWidth)
	const ratio = courtHeight / courtWidth
	const height = Math.floor(width * ratio)
	select('svg').attr('width', width).attr('height', height)
	select('#clip').attr('width', width).attr('height', height)

	const hexRadius = Math.floor(width * binRatio)
	hexbinner.size([width, height])
	hexbinner.radius(hexRadius)

	scales.shotX.range([0, width])
	scales.shotY.range([height, 0])
	scales.radius.range([1, hexRadius])
}

function updateData(data) {
	const points = data.map(datum => ({
		x: scales.shotX(+datum['shot-x']),
		y: scales.shotY(+datum['shot-y']),
		shotX: +datum['shot-x'],
		shotY: +datum['shot-y'],
		made: datum.event.toLowerCase().indexOf('missed') < 0,
	}))

	const hexbinData = hexbinner(points.map(point => {
		const { made, shotX, shotY } = point
		return [point.x, point.y, { made, shotX, shotY }]
	}))

	const maxRadius = max(hexbinData, d => d.length)

	 //    // what does hexbin.hexagon do? (looks like it returns a path what params?)
	 //    svg.append('g')
	 //      .attr('clip-path', 'url(#clip)')
	 //      .selectAll('.hexagon')
	 //      .data(hexbinData)
	 //      .enter().append('path')
	 //      .attr('class', 'hexagon')
	 //      .attr('d', function(d) { return hexbin.hexagon() })
	 //      .attr('transform', function(d) {
	 //        return 'translate(' + d.x + ',' + d.y + ')';
	 //      })
	 //      .style('fill', function(d) {
		// 	const made = d.reduce(function(previous, current) {
		// 		return previous += current[2].made ? 1 : 0
		// 	}, 0)
		// 	const percent = made / d.length
		// 	console.log(percent)
		// 	return color(percent)
	 //      })
	 //      .style('stroke', 'none');
}

export default { setup, updateData }