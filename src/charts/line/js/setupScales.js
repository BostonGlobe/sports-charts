import d3 from 'd3'

// map user options to d3 scales
const scaleOptions = {
	date: d3.scaleTime,
	number: d3.scaleLinear,
}

export default ({ rows, mappings, encoding, width, height }) => ({

	x: scaleOptions[mappings[encoding.x.field]]()
		.range([0, width])
		.domain(d3.extent(rows, d => d[encoding.x.field])),

	y: scaleOptions[mappings[encoding.y.field]]()
		.range([height, 0])
		.domain(d3.extent(rows, d => d[encoding.y.field]))

})