// drawing court from final perspective, not original inverted dimensions
import { arc } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { dimensions } from './config'

const { left, right, top, bottom } = dimensions
const rinkWidth = bottom - top
const rinkHeight = right - left

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

	console.log(11, sz(11))
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
	// 	.attr('x1', sz(cornerThreeFromEdge.x))
	// 	.attr('y1', height)
	// 	.attr('x2', sz(cornerThreeFromEdge.x))
	// 	.attr('y2', sz(courtHeight - cornerThreeFromEdge.y))

	// // three right corner
	// court.append('line')
	// 	.attr('class', 'court-line three-left-corner round')
	// 	.attr('x1', sz(courtWidth - cornerThreeFromEdge.x))
	// 	.attr('y1', height)
	// 	.attr('x2', sz(courtWidth - cornerThreeFromEdge.x))
	// 	.attr('y2', sz(courtHeight - cornerThreeFromEdge.y))

	// // paint
	// court.append('rect')
	// 	.attr('class', 'court-shape paint')
	// 	.attr('x', sz(courtWidth / 2 - paintWidth / 2))
	// 	.attr('y', sz(courtHeight - freeThrowLine))
	// 	.attr('width', sz(paintWidth))
	// 	.attr('height', sz(freeThrowLine))

	// // three point arc
	// const threeArc = arc()
	// 	.innerRadius(sz(threeFromHoop))
	// 	.outerRadius(sz(threeFromHoop))
	// 	.startAngle(-pi / 2.64)
	// 	.endAngle(pi / 2.64)

	// court.append('path')
	// 	.attr('class', 'court-line three-arc round')
	// 	.attr('d', threeArc)
	// 	.attr('transform', `translate(${sz(courtWidth / 2)},${sz(courtHeight - hoopY)})`)

	// // free throw arc
	// const freeThrowArc = arc()
	// 	.innerRadius(sz(freeThrowRadius))
	// 	.outerRadius(sz(freeThrowRadius))
	// 	.startAngle(-pi / 2)
	// 	.endAngle(pi / 2)

	// court.append('path')
	// 	.attr('class', 'court-line free-throw-arc')
	// 	.attr('d', freeThrowArc)
	// 	.attr('transform', `translate(${sz(courtWidth / 2)},${sz(courtHeight - freeThrowLine)})`)

	// // free throw arc under
	// const freeThrowArcUnder = arc()
	// 	.innerRadius(sz(freeThrowRadius))
	// 	.outerRadius(sz(freeThrowRadius))
	// 	.startAngle(pi / 2)
	// 	.endAngle(pi * 1.5)

	// const dashes = () => `${sz(1.292)},`.repeat(12)
	// // console.log(dashes())
	// court.append('path')
	// 	.attr('class', 'court-line free-throw-arc-under')
	// 	.attr('d', freeThrowArcUnder)
	// 	// .attr('stroke-dasharray', `${sz(1)},${sz(1)}`)
	// 	.attr('transform', `translate(${sz(courtWidth / 2)},${sz(courtHeight - freeThrowLine)})`)

	// // half court
	// court.append('circle')
	// 	.attr('class', 'court-shape half-court-outer')
	// 	.attr('cx', sz(courtWidth / 2))
	// 	.attr('cy', 0)
	// 	.attr('r', sz(halfCourtOuterRadius))

	// court.append('circle')
	// 	.attr('class', 'court-shape half-court-inner')
	// 	.attr('cx', sz(courtWidth / 2))
	// 	.attr('cy', 0)
	// 	.attr('r', sz(halfCourtInnerRadius))

	// // backboard
	// basket.append('line')
	// 	.attr('class', 'backboard')
	// 	.attr('x1', sz(courtWidth / 2 - backboardWidth / 2))
	// 	.attr('y1', sz(courtHeight - hoopY - backboardFromHoop))
	// 	.attr('x2', sz(courtWidth / 2 + backboardWidth / 2))
	// 	.attr('y2', sz(courtHeight - hoopY - backboardFromHoop))

	// // hoop
	// basket.append('circle')
	// 	.attr('class', 'hoop')
	// 	.attr('cx', sz(courtWidth / 2))
	// 	.attr('cy', sz(courtHeight - hoopY))
	// 	.attr('r', sz(hoopRadius))

}
