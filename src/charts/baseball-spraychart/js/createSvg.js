import { select } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { arc } from 'd3-shape'

const π = Math.PI

const createSvg = ({ container, margins, width, height, parkSize }) => {

	let { top, right, bottom, left } = margins
	top = top / 2
	right = right / 2
	bottom = bottom / 2
	left = left / 2
	width = width / 2
	height = height / 2

	// create svg
	const svg = select(container).append('svg')
		.attr('width', width + left + right)
		.attr('height', height + top + bottom)
		.attr('viewBox', [0, 0, width + left + right, height + top + bottom].join(' '))
		.attr('preserveAspectRatio', 'xMidYMid')

	const g = svg.append('g')
		.attr('class', 'root')
		.attr('transform', `translate(${width/2 + left}, ${height + top})`)

	// create parkScale
	const parkScale = scaleLinear()
		.domain([0, parkSize])
		.range([0, height])

	// create arc generator
	const arcGenerator = arc()
		.innerRadius(0)
		.outerRadius(parkScale(parkSize))
		.startAngle(-π/4)
		.endAngle(π/4)

	// make ballpark
	g.append('path')
		.attr('class', 'ballpark')
		.attr('d', arcGenerator)

	// make ballpark clip
	g.append('clipPath')
		.attr('id', 'ballpark-clip')
	.append('path')
		.attr('d', arcGenerator)

	// make grid
	g.selectAll('.grid')
		.data([200, 300, 400])
	.enter().append('circle')
		.attr('class', 'grid')
		.attr('r', parkScale)
		.attr('cx', 0)
		.attr('cy', 0)

	// make grid ticks
	g.selectAll('.tick')
		.data([200, 300, 400])
	.enter().append('text')
		.attr('class', 'tick')
		.attr('x', d => parkScale(Math.cos(-π/4) * d))
		.attr('y', d => parkScale(Math.sin(-π/4) * d))
		.attr('dx', 0)
		.attr('dy', 10)
		.text((d, i) => i === 1 ? `${d}ft` : d)

	// make infield
	g.append('circle')
		.attr('class', 'infield')
		.attr('clip-path', 'url(#ballpark-clip)')
		.attr('r', parkScale(95))
		.attr('cx', 0)
		.attr('cy', -parkScale(Math.sqrt(2*Math.pow(90, 2))/2))

	// make diamond
	g.append('rect')
		.attr('class', 'diamond')
		.attr('width', parkScale(90))
		.attr('height', parkScale(90))
		.attr('x', 0)
		.attr('y', -parkScale(90))
		.attr('transform',
			`rotate(-45) translate(${parkScale(10)}, -${parkScale(10)})`)

	return svg

}

export default createSvg
