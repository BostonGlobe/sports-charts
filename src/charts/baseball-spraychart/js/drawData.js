import { select } from 'd3-selection'

import colors from './../../../utils/colors.js'

const drawData = ({ data, detachedContainer, scales }) => {

	const { x, y } = scales

	// get the custom data container
	const dataContainer = select(detachedContainer)

	// JOIN
	const circles = dataContainer.selectAll('custom.circle')
		.data(data, d => d.index)

	// EXIT
	circles.exit().remove()

	// UPDATE
	// circles.attr(...)

	// ENTER
	circles.enter().append('custom')
		.attr('class', 'circle')
		.attr('cx', x)
		.attr('cy', y)
		.attr('r', d => d.description === 'Home run' ? 8 : 5)
		.attr('strokeStyle', d => ({
			Out: colors.gray3,
			Single: colors.redsox2,
			Double: colors.redsox2,
			Triple: colors.redsox2,
			'Home run': colors.redsox1,
		}[d.description] || colors.gray3))
		.attr('fillStyle', d => ({
			Out: colors.gray3,
			Single: 'white',
			Double: 'white',
			Triple: colors.redsox2,
			'Home run': colors.redsox1,
		}[d.description] || 'white'))

}

export default drawData
