import d3 from 'd3'
import { $ } from '../../../utils/dom.js'

// convenience variables
const container = $('.chart-container')
const $svg = $('.chart-container svg')

// TODO
// label end datum
// setup automatic padding

const setupScales = ({ rows, mappings, encoding, width, height }) => {

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

	// hardcode chart to these dimensions for now
	const outerWidth = 300
	const outerHeight = outerWidth * 0.75

	// setup margins
	const margin = { top: 20, right: 20, bottom: 30, left: 70 }
	const width = outerWidth - margin.left - margin.right
	const height = outerHeight - margin.top - margin.bottom

	// setup svg
	const svg = d3.select($svg)
		.attr('width', outerWidth)
		.attr('height', outerHeight)
	.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)

	// setup scales
	const { x, y } = setupScales({ rows, mappings, encoding, width, height })

	// setup line generator
	const line = d3.line()
		.x(d => x(d[encoding.x.field]))
		.y(d => y(d[encoding.y.field]))

	svg.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(x)
			.ticks(5)
		)

	svg.append('g')
		.attr('class', 'axis axis--y')
		.call(d3.axisLeft(y)
			.ticks(5)
		)
	.append('text')
		.attr('class', 'axis-title')
		.attr('y', 0)
		.attr('dy', '-0.5em')
		.style('text-anchor', 'end')
		.text('Price ($)')

	svg.append('path')
		.datum(rows)
		.attr('d', line)

}

export default {
	setup,
}

