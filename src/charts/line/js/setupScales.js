import { scaleTime, scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'

// map user options to d3 scaless
const scaleOptions = {
	date: scaleTime,

	number: scaleLinear,
	test: scaleLinear,
}

export default ({ rows, mappings, encoding, width, height }) => ({

	x: scaleOptions[mappings[encoding.x.field]]()
		.range([0, width])
		.domain(extent(rows, d => d[encoding.x.field])),

	y: scaleOptions[mappings[encoding.y.field]]()
		.range([height, 0])
		.domain(extent(rows, d => d[encoding.y.field]))

})