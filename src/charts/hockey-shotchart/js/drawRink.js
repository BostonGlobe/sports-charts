// drawing court from final perspective, not original inverted dimensions
import { arc } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { dimensions } from './config'

const { left, right, top, bottom } = dimensions
const rinkWidth = bottom - top
// const rinkHeight = right - left

const sz = scaleLinear().domain([0, rinkWidth])
const pi = Math.PI
const cornerRadius = 14
const thinLine = 2
const thickLine = 6
const spotRadius = 1
const goalLine = 11
const blueLineFromTop = 25
const creaseWidth = 8
const creaseHeight = 4.5
const faceoffRadius = 15
const faceoffOffsetX = 22
const faceoffOffsetY = goalLine + 20
const netWidth = 6
const netDepth = 3.66

export default function drawRink({ rink, width, height }) {
	sz.range([0, width])

	const center = width / 2

	const creaseArc = arc()
		.innerRadius(sz(6))
		.outerRadius(sz(6))
		.startAngle(-pi / 4)
		.endAngle(pi / 4)

	// entire ice surface
	rink.append('rect')
		.attr('class', 'rink-bg')
		.attr('x', 0)
		.attr('y', -sz(cornerRadius))
		.attr('width', width)
		.attr('height', height + sz(cornerRadius))
		.attr('rx', sz(cornerRadius))
		.attr('ry', sz(cornerRadius))

	// goal line
	rink.append('rect')
		.attr('class', 'rink-rect rink-goal-line')
		.attr('x', 0)
		.attr('y', height - sz(11))
		.attr('width', width)
		.attr('height', thinLine)

	// blue line
	rink.append('rect')
		.attr('class', 'rink-rect rink-blue-line')
		.attr('x', 0)
		.attr('y', sz(blueLineFromTop))
		.attr('width', width)
		.attr('height', thickLine)

	// crease
	rink.append('line')
		.attr('class', 'rink-line crease-line')
		.attr('x1', center - sz(creaseWidth / 2))
		.attr('y1', height - sz(goalLine))
		.attr('x2', center - sz(creaseWidth / 2))
		.attr('y2', height - sz(goalLine + creaseHeight))

	rink.append('line')
		.attr('class', 'rink-line crease-line')
		.attr('x1', center + sz(creaseWidth / 2))
		.attr('y1', height - sz(goalLine))
		.attr('x2', center + sz(creaseWidth / 2))
		.attr('y2', height - sz(goalLine + creaseHeight))

	rink.append('path')
		.attr('class', 'rink-line crease-arc')
		.attr('d', creaseArc)
		.attr('transform', `translate(${center},${height - sz(goalLine)})`)

	// faceoff circles
	rink.append('circle')
		.attr('class', 'rink-circle faceoff faceoff-center')
		.attr('cx', center)
		.attr('cy', 0)
		.attr('r', sz(faceoffRadius))

	rink.append('circle')
		.attr('class', 'rink-circle faceoff faceoff-left')
		.attr('cx', center - sz(faceoffOffsetX))
		.attr('cy', height - sz(faceoffOffsetY))
		.attr('r', sz(faceoffRadius))

	rink.append('circle')
		.attr('class', 'rink-circle faceoff faceoff-right')
		.attr('cx', center + sz(faceoffOffsetX))
		.attr('cy', height - sz(faceoffOffsetY))
		.attr('r', sz(faceoffRadius))

	// spots
	rink.append('circle')
		.attr('class', 'rink-circle-fill faceoff faceoff-center')
		.attr('cx', center)
		.attr('cy', 0)
		.attr('r', sz(spotRadius))

	rink.append('circle')
		.attr('class', 'rink-circle-fill faceoff faceoff-left')
		.attr('cx', center - sz(faceoffOffsetX))
		.attr('cy', height - sz(faceoffOffsetY))
		.attr('r', sz(spotRadius))

	rink.append('circle')
		.attr('class', 'rink-circle-fill faceoff faceoff-right')
		.attr('cx', center + sz(faceoffOffsetX))
		.attr('cy', height - sz(faceoffOffsetY))
		.attr('r', sz(spotRadius))

	// net
	rink.append('rect')
		.attr('class', 'rink-rect rink-net')
		.attr('x', center - sz(netWidth / 2))
		.attr('y', height - sz(goalLine))
		.attr('width', sz(netWidth))
		.attr('height', sz(netDepth / 2))

	rink.append('rect')
		.attr('class', 'rink-rect rink-net')
		.attr('x', center - sz(netWidth / 2))
		.attr('y', height - sz(goalLine))
		.attr('rx', sz(netWidth / 4))
		.attr('width', sz(netWidth))
		.attr('height', sz(netDepth))

}
