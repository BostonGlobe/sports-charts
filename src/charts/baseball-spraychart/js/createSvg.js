import { select } from 'd3-selection'

export default function createSvg({ container }) {

	// setup chart margins
	const top = 3, right = 3, bottom = 3, left = 3
	const width = container.offsetWidth - left - right
	const height = Math.sqrt(Math.pow(container.offsetWidth, 2)/2) -
		top - bottom

	// create svg element
	let svg = select(container).append('svg')
		.attr('width', width + left + right)
		.attr('height', height + top + bottom)
		.append('g')

	// svg.attr('transform',`translate(${left + 0.5},${top + 0.5})`)

	// console.log('create svg')

}
