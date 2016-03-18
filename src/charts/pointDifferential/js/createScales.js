import { scaleBand, scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'

const createScales = ({ width, height, data }) => ({

	x: scaleBand()
		.rangeRound([0, width])
		.domain(data.map(d => d.gameno))
		.padding(0.1),

	y: scaleLinear()
		.rangeRound([height, 0])
		.domain(extent(data, d => d['run-differential'])),

})

export default createScales
