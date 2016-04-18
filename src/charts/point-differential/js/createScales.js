import { scaleBand, scaleLinear } from 'd3-scale'
import { max } from 'd3-array'

const createScales = ({ width, height, data }) => {

	const maxY = max(data, d => Math.abs(d.runDifferential))

	return {

		x: scaleBand()
			.rangeRound([0, width])
			.domain(data.map(d => d.gameno))
			.padding(0.1),

		y: scaleLinear()
			.rangeRound([height, 0])
			.domain([-maxY, maxY]),

	}

}

export default createScales
