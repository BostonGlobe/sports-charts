// drawing court from final perspective, not original inverted dimensions
import { arc } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import { dimensions } from './config'

const { left, right, top, bottom } = dimensions
const courtWidth = right - left
const courtHeight = bottom - top

const sz = scaleLinear().domain([0, courtWidth])
const pi = Math.PI

const cornerThreeFromEdge = { x: 3, y: 14 }
const paintWidth = 16
const freeThrowLine = 19
const hoopRadius = 0.75
const hoopY = Math.abs(top)
const threeFromHoop = 23.75
const backboardWidth = 6
const backboardFromHoop = -1.25
const freeThrowRadius = 6
const halfCourtOuterRadius = 6
const halfCourtInnerRadius = 2

export default function drawCourt({ court, basket, width, height }) {
	sz.range([0, width])
	court.append('line')
		.attr('class', 'court-line three-left-corner round')
		.attr('x1', sz(cornerThreeFromEdge.x))
		.attr('y1', height)
		.attr('x2', sz(cornerThreeFromEdge.x))
		.attr('y2', sz(courtHeight - cornerThreeFromEdge.y))

	// three right corner
	court.append('line')
		.attr('class', 'court-line three-left-corner round')
		.attr('x1', sz(courtWidth - cornerThreeFromEdge.x))
		.attr('y1', height)
		.attr('x2', sz(courtWidth - cornerThreeFromEdge.x))
		.attr('y2', sz(courtHeight - cornerThreeFromEdge.y))

	// paint
	court.append('rect')
		.attr('class', 'court-shape paint')
		.attr('x', sz(courtWidth / 2 - paintWidth / 2))
		.attr('y', sz(courtHeight - freeThrowLine))
		.attr('width', sz(paintWidth))
		.attr('height', sz(freeThrowLine))

	// three point arc
	const threeArc = arc()
		.innerRadius(sz(threeFromHoop))
		.outerRadius(sz(threeFromHoop))
		.startAngle(-pi / 2.64)
		.endAngle(pi / 2.64)

	court.append('path')
		.attr('class', 'court-line three-arc round')
		.attr('d', threeArc)
		.attr('transform', `translate(${sz(courtWidth / 2)},${sz(courtHeight - hoopY)})`)

	// free throw arc
	const freeThrowArc = arc()
		.innerRadius(sz(freeThrowRadius))
		.outerRadius(sz(freeThrowRadius))
		.startAngle(-pi / 2)
		.endAngle(pi / 2)

	court.append('path')
		.attr('class', 'court-line free-throw-arc')
		.attr('d', freeThrowArc)
		.attr('transform', `translate(${sz(courtWidth / 2)},${sz(courtHeight - freeThrowLine)})`)

	// free throw arc under
	const freeThrowArcUnder = arc()
		.innerRadius(sz(freeThrowRadius))
		.outerRadius(sz(freeThrowRadius))
		.startAngle(pi / 2)
		.endAngle(pi * 1.5)

	// const dashes = () => `${sz(1.292)},`.repeat(12)
	// console.log(dashes())
	court.append('path')
		.attr('class', 'court-line free-throw-arc-under')
		.attr('d', freeThrowArcUnder)
		// .attr('stroke-dasharray', `${sz(1)},${sz(1)}`)
		.attr('transform', `translate(${sz(courtWidth / 2)},${sz(courtHeight - freeThrowLine)})`)

	// half court
	court.append('circle')
		.attr('class', 'court-shape half-court-outer')
		.attr('cx', sz(courtWidth / 2))
		.attr('cy', 0)
		.attr('r', sz(halfCourtOuterRadius))

	court.append('circle')
		.attr('class', 'court-shape half-court-inner')
		.attr('cx', sz(courtWidth / 2))
		.attr('cy', 0)
		.attr('r', sz(halfCourtInnerRadius))

	// backboard
	basket.append('line')
		.attr('class', 'backboard')
		.attr('x1', sz(courtWidth / 2 - backboardWidth / 2))
		.attr('y1', sz(courtHeight - hoopY - backboardFromHoop))
		.attr('x2', sz(courtWidth / 2 + backboardWidth / 2))
		.attr('y2', sz(courtHeight - hoopY - backboardFromHoop))

	// hoop
	basket.append('circle')
		.attr('class', 'hoop')
		.attr('cx', sz(courtWidth / 2))
		.attr('cy', sz(courtHeight - hoopY))
		.attr('r', sz(hoopRadius))

}
