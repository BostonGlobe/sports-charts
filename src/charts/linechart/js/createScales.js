import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'

const createScales = ({ width, height, data, dimensions }) => ({

	x: scaleLinear()
		.range([0, width])
		.domain(extent(data, d => d[dimensions.x])),

	y: scaleLinear()
		.range([height, 0])
		.domain(extent(data, d => d[dimensions.y])),

})

export default createScales

