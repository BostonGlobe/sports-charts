import { select } from 'd3-selection'

const createCanvas = ({ container, margins, width, height }) => {

	const { top, right, bottom, left } = margins

	// create canvas element
	const canvas = select(container).append('canvas')
		.attr('width', width + left + right)
		.attr('height', height + top + bottom)
		.attr('innerWidth', width)
		.attr('innerHeight', height)
		.node()

	// make room for margins
	canvas.getContext('2d').translate(left + width / 2, top)

	return canvas

}

export default createCanvas
