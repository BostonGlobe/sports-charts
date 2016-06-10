import d3 from 'd3'
import _ from 'lodash'
import { $ } from '../../../utils/dom.js'
import { titleize } from 'underscore.string'
import drawChart from './drawChart.js'

// convenience variables
const container = $('.chart-container')

// hardcode chart to these dimensions for now
const outerWidth = 300
const outerHeight = outerWidth * 0.75

// TODO
// add initial transition
// sort values
// deal with baseline/no baseline

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

	// we are going to draw the chart in 2 stages:
	// first we'll draw a chart with default margins, axes, no lines
	// we'll get the axes dimensions and then...
	const margins = drawChart({ container, outerWidth, outerHeight, rows,
		mappings, encoding, lineData, labelData })

	// ...redraw the chart, this time with the correct margins
	drawChart({ container, outerWidth, outerHeight, rows, mappings, margins,
		encoding, lineData, labelData })

	$('.chart-y-axis-title').innerHTML =
		axesLabels.y || titleize(encoding.y.field)

}

export default {
	setup,
}

