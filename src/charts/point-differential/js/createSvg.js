import { select } from 'd3-selection'

const createSvg = ({ container, margins, width, height }) => {

	const { top, right, bottom, left } = margins

	// create svg
	const svg = select(container).append('svg')
		.attr('width', width + left + right)
		.attr('height', height + top + bottom)
		.attr('viewBox',
			[0, 0, width + left + right, height + top + bottom].join(' '))
		.attr('preserveAspectRatio', 'xMidYMid')

	const g = svg.append('g')
		.attr('class', 'root')
		.attr('transform', `translate(${left}, ${top})`)

	const axes = g.append('g')
		.attr('class', 'axes')

	axes.append('g')
		.classed('axes--y', true)

	axes.append('g')
		.classed('axes--x', true)
		.attr('transform', `translate(0, ${height})`)
	.append('text')
		.classed('label', true)
		.attr('transform', `translate(${width/2}, ${bottom})`)
		.attr('text-anchor', 'middle')
		.attr('dy', -4)

	g.append('g')
		.attr('class', 'bars')

	return g

}

export default createSvg
