import { timeFormat } from 'd3-time-format'
import { axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
import { extent } from 'd3-array'

const dateFormat = timeFormat('%b. %e')

const drawData = ({ svg, data, scales }) => {

	const { x, y } = scales

	// JOIN
	const bars = svg.select('g.bars').selectAll('rect')
		.data(data, d => d.id)

	// EXIT
	bars.exit()
		.remove()

	// ENTER
	bars.enter().append('rect')
		.attr('x', d => x(d.gameno))
		.attr('y', d => Math.min(y(d.runDifferential), y(0)))
		.attr('width', x.bandwidth())
		.attr('height', d => Math.abs(y(d.runDifferential) - y(0)))
		.classed('positive', d => d.runDifferential > 0)

	const axisY = axisLeft(y)
		.tickSize(-x.range()[1])
		.ticks(10)
		.tickFormat((d, i, a) => i === a.length - 1 ? `${d}` : d)

	svg.select('g.axes--y')
		.call(axisY)
		.selectAll('g.tick')
		.classed('baseline', d => d === 0)
		.attr('transform', d => `translate(0, ${y(d) - (d < 0 ? 1 : 0)})`)

	svg.select('g.axes--x text.label')
		.text(extent(data, d => d.gameDate).map(dateFormat).join(' ‐ '))

}

export default drawData
