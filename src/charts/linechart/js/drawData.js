import { select } from 'd3-selection'
import { line } from 'd3-shape'

const drawData = ({ data, g, scales, dimensions }) => {

	const { group } = dimensions
	const finalData = group ? data : [data]

	const { x, y } = scales

	const lineGenerator = line()
		.x(d => x(d[dimensions.x]))
		.y(d => y(d[dimensions.y]))

	// JOIN
	const lineGroups = g.selectAll('g.line')
		.data(finalData)

	// EXIT
	lineGroups.exit()
		.remove()

	// ENTER
	lineGroups.enter().append('g')
		.attr('class', 'line')
	.append('path')
		.attr('d', lineGenerator)

}

export default drawData

