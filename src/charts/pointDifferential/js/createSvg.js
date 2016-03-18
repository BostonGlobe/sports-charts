import { select } from 'd3-selection'

const createSvg = ({ container, margins, width, height }) => {

	// dimensions are coming in doubled, for canvas. we need to halve them.
	let { top, right, bottom, left } = margins
	top = top / 2
	right = right / 2
	bottom = bottom / 2
	left = left / 2
	const newWidth = width / 2
	const newHeight = height / 2

	// create svg
	const svg = select(container).append('svg')
		.attr('width', newWidth + left + right)
		.attr('height', newHeight + top + bottom)
		.attr('viewBox', [0, 0, newWidth + left + right, newHeight + top + bottom].join(' '))
		.attr('preserveAspectRatio', 'xMidYMid')

	const g = svg.append('g')
		.attr('class', 'root')
		.attr('transform', `translate(${left}, ${top})`)

	return g

}

export default createSvg
