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

	return g

}

export default createSvg

