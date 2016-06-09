import d3 from 'd3'
import _ from 'lodash'
import { $ } from '../../../utils/dom.js'
import labeler from 'd3fc-label-layout'
import { titleize } from 'underscore.string'

// convenience variables
const container = $('.chart-container')
const $svg = $('.chart-container svg')

// TODO
// setup automatic padding
// add initial transition
// style everything
// sort values
// deal with baseline/no baseline

const setupScales = ({ rows, mappings, encoding, width, height }) => {

	const options = {
		date: d3.scaleTime,
		number: d3.scaleLinear,
	}

	const x = options[mappings[encoding.x.field]]()
		.range([0, width])
		.domain(d3.extent(rows, d => d[encoding.x.field]))

	const y = options[mappings[encoding.y.field]]()
		.range([height, 0])
		.domain(d3.extent(rows, d => d[encoding.y.field]))

	return { x, y }

}

const setup = ({ rows, mappings, encoding, axesLabels }) => {

	// hardcode chart to these dimensions for now
	const outerWidth = 300
	const outerHeight = outerWidth * 0.75

	// setup margins
	const margin = { top: 20, right: 40, bottom: 25, left: 45 }
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

	// setup x axis
	svg.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(x)
			.ticks(5)
		)

	// setup y axis
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
		.text(axesLabels.y || titleize(encoding.y.field))

	const lineData = _(rows)
		.groupBy(encoding.color ? encoding.color.field : _.noop)
		.map((value, key) => ({
			key,
			value,
		}))
		.value()

	// setup lines
	svg.append('g')
			.attr('class', 'lines')
		.selectAll('path')
			.data(lineData, d => d.key)
		.enter().append('path')
			.attr('d', d => line(d.value))
			.attr('class', (d, i) => `line-${i}`)

	// setup labels
	const textLabel = labeler.textLabel()
		.padding(2)
		.value(d => d.symbol)

	const labelStrategy = labeler.annealing()
		.bounds([width, height])

	const labels = labeler.label(labelStrategy)
		.size(d => [width, 16])
		.position(d => [
			x(d.date),
			y(d.price),
		])
		.component(textLabel)

	const labelData = _(lineData)
		.map(d => _.last(d.value))
		.value()

	svg.append('g')
			.attr('class', 'labels')
			.attr('transform', `translate(${width}, 0)`)
		.datum(labelData)
			.call(labels)

}

export default {
	setup,
}

