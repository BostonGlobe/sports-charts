import { scalePoint, scaleLinear } from 'd3-scale'

const π = Math.PI

const createScales = ({ parkSize, height }) => {

	// start creating scales. first: zones to angles.
	// each zone is represented by one of the 26 letters
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

	// 22 zones: π/2, or 90 deg
	// 2 zones: π/22
	// finally we rotate everything by π/4 counterclockwise
	const zoneToAngle = scalePoint()
		.domain(letters)
		.range([π / 4 + 2 * π / 4 + π / 22, π / 4 - π / 22])

	// create x-scale
	const xScale = scaleLinear()
		.domain([0, parkSize])
		.range([0, height])

	// create y-scale
	const yScale = scaleLinear()
		.domain([0, parkSize])
		.range([height, 0])

	// convert from polar to cartesian coordinates,
	// but still ensure that we stay in the distance domain, whatever that is
	const convertFromPolarToCartesian = (d) => {
		const { distance, zone } = d
		const angle = zoneToAngle(zone)
		const x = distance * Math.cos(angle)
		const y = distance * Math.sin(angle)
		return { x, y }
	}

	// x-scale function
	const x = (d) => {
		const cartesian = convertFromPolarToCartesian(d)
		const result = xScale(cartesian.x)
		return result
	}

	// y-scale function
	const y = (d) => {
		const cartesian = convertFromPolarToCartesian(d)
		const result = yScale(cartesian.y)
		return result
	}

	// setup origin helper constant
	const origin = {
		x: x({ distance: 0, zone: 'A' }),
		y: y({ distance: 0, zone: 'A' }),
	}

	return { x, y, origin }

}

export default createScales
