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

	// create line data
	const lineData = _(rows)
		.groupBy(encoding.color ? encoding.color.field : _.noop)
		.map((value, key) => ({
			key,
			value,
		}))
		.value()

	// create label data
	const labelData = _(lineData)
		.map(d => _.last(d.value))
		.value()

	// setup svg
	const root = d3.select($svg)

	// setup svg g
	const svg = root.append('g')

	// create hidden labels container
	const hiddenLabels = svg.append('g')
		.attr('class', 'labels-hidden')

	// add hidden labels
	hiddenLabels.selectAll('text')
			.data(labelData)
		.enter().append('text')
		.text(d => d[encoding.color.field])

	// get hidden labels bbox
	const labelsBBox = hiddenLabels.node().getBBox()
	const labelsWidth = labelsBBox.width
	const labelsHeight = hiddenLabels.select('text').node().getBBox().height

	// hardcode chart to these dimensions for now
	const outerWidth = 300
	const outerHeight = outerWidth * 0.75

	// setup margins
	const margin = { top: 25, right: labelsWidth, bottom: 25, left: 50 }
	const width = outerWidth - margin.left - margin.right
	const height = outerHeight - margin.top - margin.bottom

	root
		.attr('width', outerWidth)
		.attr('height', outerHeight)

	svg
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
			.tickSize(0)
			.tickPadding(5)
			.ticks(5)
		)

	// setup y axis
	svg.append('g')
		.attr('class', 'axis axis--y')
		.call(d3.axisLeft(y)
			.tickSize(0)
			.ticks(5)
		)
	.append('text')
		.attr('class', 'axis-title')
		.attr('y', 0)
		.attr('dy', '-0.75em')
		.style('text-anchor', 'end')
		.text(axesLabels.y || titleize(encoding.y.field))

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
		.padding(0)
		.value(d => d[encoding.color.field])

	const labelStrategy = labeler.annealing()
		.bounds([width, height])

	const labels = labeler.label(labelStrategy)
		.size(d => [labelsWidth, labelsHeight + 2])
		.position(d => [
			x(d[encoding.x.field]),
			y(d[encoding.y.field]),
		])
		.component(textLabel)

	svg.append('g')
			.attr('class', 'labels')
			.attr('transform', `translate(${labelsWidth}, 0)`)
		.datum(labelData)
			.call(labels)

}

export default {
	setup,
}

