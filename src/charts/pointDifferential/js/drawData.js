import { select } from 'd3-selection'
// eslint-disable-next-line no-unused-vars
// import { transition } from 'd3-transition'

import colors from './../../../utils/colors.js'

const drawData = ({ data, detachedContainer, scales }) => {

	const { x, y } = scales

	// get the custom data container
	const dataContainer = select(detachedContainer)

	// JOIN
	const rects = dataContainer.selectAll('custom.rect')
		.data(data, d => d.index)

	// EXIT
	rects.exit()
		.remove()

	// ENTER
	rects.enter().append('custom')
		.attr('class', 'rect')
		.attr('x', d => x(d.gameno))
		.attr('y', d => Math.min(y(d['run-differential']), y(0)))
		.attr('width', x.bandwidth())
		.attr('height', d => Math.abs(y(d['run-differential']) - y(0)))
		.attr('fill', d => d['run-differential'] > 0 ?
			colors['redsox-secondary'] :
			colors['gray-secondary'])

}

export default drawData
