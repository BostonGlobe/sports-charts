import { timeFormat } from 'd3-time-format'
import { axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
import { extent } from 'd3-array'

const dateFormat = timeFormat('%b. %e')

import colors from './../../../utils/colors.js'

const drawData = ({ svg, data, detachedContainer, scales }) => {

	const { x, y } = scales

	// JOIN
	const bars = svg.select('g.bars').selectAll('rect')
		.data(data, d => d.index)

	// EXIT
	bars.exit()
		.remove()

	// ENTER
	bars.enter().append('rect')
		.attr('x', d => x(d.gameno))
		.attr('y', d => Math.min(y(d['run-differential']), y(0)))
		.attr('width', x.bandwidth())
		.attr('height', d => Math.abs(y(d['run-differential']) - y(0)))
		.style('fill', d => d['run-differential'] > 0 ?
			colors['redsox-secondary'] :
			colors['gray-secondary'])

	const axisY = axisLeft(y)
		.tickSize(-x.range()[1])
		.ticks(10)
		.tickFormat((d, i, a) => i === a.length - 1 ? `${d}` : d)

	svg.select('g.axes--y')
		.call(axisY)

	svg.select('g.axes--x text.label')
		.text(extent(data, d => d.gamedate).map(dateFormat).join(' ‐ '))

}

export default drawData
