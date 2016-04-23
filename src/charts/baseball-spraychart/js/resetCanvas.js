import { select } from 'd3-selection'

const resetCanvas = ({ container, margins, width, height }) => {

	const { top, right, bottom, left } = margins

	// create canvas element
	const canvas = select(container).select('canvas')
		.attr('width', width + left + right)
		.attr('height', height + top + bottom)
		.attr('innerWidth', width)
		.attr('innerHeight', height)
		.node()

	const ctx = canvas.getContext('2d')

	// reset transform
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	// make room for margins
	ctx.translate(left + width / 2, top)

	return canvas

}

export default resetCanvas
