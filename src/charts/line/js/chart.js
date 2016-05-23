import d3 from 'd3'
import { $ } from '../../../utils/dom.js'

// convenience variables
const container = $('.chart-container')
const $svg = $('.chart-container svg')

// hardcode chart to these dimensions for now
const width = 280
const height = width * 0.5

const setupScales = ({ rows, mappings, encoding }) => {

	const options = {
		temporal: d3.scaleTime,
		quantitative: d3.scaleLinear,
	}

	const x = options[encoding.x.type]()
		.range([0, width])
		.domain(d3.extent(rows, d => d[encoding.x.field]))

	const y = options[encoding.y.type]()
		.range([height, 0])
		.domain(d3.extent(rows, d => d[encoding.y.field]))

	return { x, y }

}

const setup = ({ rows, mappings, encoding }) => {

	// setup svg
	const svg = d3.select($svg)
		.attr('width', width)
		.attr('height', height)

	// setup scales
	const { x, y } = setupScales({ rows, mappings, encoding })

	const line = d3.line()
		.x(d => x(d[encoding.x.field]))
		.y(d => y(d[encoding.y.field]))

	svg.append('path')
		.datum(rows)
		.attr('d', line)

}

export default {
	setup,
}

