import d3 from 'd3'
import setupScales from './setupScales.js'
import labeler from 'd3fc-label-layout'

const defaultMargins = { top: 50, right: 50, bottom: 50, left: 50 }

export default ({ container, margins, lineData, labelData,
outerWidth, outerHeight, rows, mappings, encoding }) => {

	const { top, right, bottom, left } = margins || defaultMargins

	const width = outerWidth - left - right
	const height = outerHeight - top - bottom

	// get existing svg
	let svg = d3.select(container).select('svg')

	// if present, remove it
	if (svg) svg.remove()

	// create it again
	svg = d3.select(container).append('svg')
		.classed('hidden', !margins)
		.attr('width', outerWidth)
		.attr('height', outerHeight)

	// setup svg g
	const g = svg.append('g')
		.attr('transform', `translate(${left}, ${top})`)

	// get scales
	const { x, y } = setupScales({ rows, mappings, encoding, width, height })

	// draw x-axis
	const xAxis = g.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(x)
			.tickSize(0)
			.tickPadding(5)
			.ticks(5)
		)

	// draw y-axis
	const yAxis = g.append('g')
		.attr('class', 'axis axis--y')
		.attr('transform', `translate(${!!margins ? -left : 0}, 0)`)
		.call(d3.axisLeft(y)
			.tickSize(!!margins ? -(width + left) : 0)
			.tickPadding(0)
			.ticks(5)
		)

	// style y-axis ticks
	yAxis.selectAll('text')
		.attr('dy', -2)
		.style('text-anchor', 'start')

	// create hidden labels container
	const hiddenLabels = g.append('g')
		.attr('class', 'labels-hidden')

	// add hidden labels
	hiddenLabels.selectAll('text')
			.data(labelData)
		.enter().append('text')
			.text(d => d[encoding.color.field])

	// get hidden labels bbox, so we can calculate labels width
	// (which is also margin.right)
	const labelsBBox = hiddenLabels.node().getBBox()
	const labelsWidth = labelsBBox.width
	const labelsHeight = hiddenLabels.select('text').node().getBBox().height

	if (margins) {

		// make curtain clip
		const curtainClip = g.append('clipPath')
				.attr('id', 'clip')
			.append('rect')
				.attr('height', height)
				.attr('width', 0)

		// setup line generator
		const line = d3.line()
			.x(d => x(d[encoding.x.field]))
			.y(d => y(d[encoding.y.field]))
			.curve(d3.curveMonotoneX)

		// draw lines
		g.append('g')
				.attr('class', 'lines')
			.selectAll('path')
				.data(lineData, d => d.key)
			.enter().append('path')
				.attr('d', d => line(d.value))
				.attr('class', (d, i) => `line-${i}`)
				.attr('clip-path', 'url(#clip)')

		curtainClip.transition()
			.duration(2000)
			.attr('width', width)
			.on('end', () => {

				svg.selectAll('g.labels')
					.transition()
					.duration(250)
					.style('opacity', 1)

			})

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
				.attr('class', 'labels hidden')
				.attr('transform', `translate(${margins.right*2}, 0)`)
			.datum(labelData)
				.call(labels)

	}

	return {
		top: 10,
		right: labelsWidth,
		bottom: xAxis.node().getBBox().height,
		left: yAxis.node().getBBox().width * 2,
	}

}
