import { select } from 'd3-selection'

export default function createCanvas({ container }) {

	const { offsetWidth } = container

	// setup chart margins
	const top = 10, right = 10, bottom = 10, left = 10
	const width = offsetWidth - left - right
	const height = Math.sqrt(Math.pow(offsetWidth, 2)/2) - top - bottom

	// create canvas element
	const canvas = select(container).append('canvas')
		.attr('width', width + left + right)
		.attr('height', height + top + bottom)
		.attr('innerWidth', width)
		.attr('innerHeight', height)
		.node()

	// make room for margins
	canvas.getContext('2d').translate(left + width/2, top);

	return canvas

}

