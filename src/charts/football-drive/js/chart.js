import { $ } from './../../../utils/dom.js'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'

// convenience variables
const container = $('.chart-container')

// hardcode chart to these dimensions for now
const outerWidth = 300
const outerHeight = outerWidth * 1
const margins = { top: 50, right: 50, bottom: 50, left: 50 }
const { top, right, bottom, left } = margins
const width = outerWidth - left - right
const height = outerHeight - top - bottom

const makeScales = () => ({

	// x: scaleLinear()
	// 	.range([0, width])
	// 	.domain([, 10]),


})

const setup = (payload) => {

	// get existing svg
	let svg = select(container).select('svg')

	// if present, remove it
	if (svg) svg.remove()

	// create it again
	svg = select(container).append('svg')
		.attr('width', outerWidth)
		.attr('height', outerHeight)

	// setup svg g
	const g = svg.append('g')
		.attr('transform', `translate(${left}, ${top})`)

	// // get scales
	// const { x, y } = setupScales({ rows, mappings, encoding, width, height })

}

const draw = (payload) => {

	console.log('payload')

}

export {
	setup,
	draw,
}
