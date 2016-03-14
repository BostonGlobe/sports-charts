import { select } from 'd3-selection'

const π = Math.PI

const drawCanvas = ({ canvas, detachedContainer }) => {

	const { width, height } = canvas

	const c = canvas.getContext('2d')

	// Store the current transformation matrix
	c.save()

	// Use the identity matrix while clearing the canvas
	c.setTransform(1, 0, 0, 1, 0, 0)
	c.clearRect(0, 0, width, height)

	// Restore the transform
	c.restore()

	const dataContainer = select(detachedContainer)

	dataContainer.selectAll('custom.circle').each(function draw() {

		const node = select(this)
		const cx = node.attr('cx')
		const cy = node.attr('cy')
		const r = node.attr('r')
		const fillStyle = node.attr('fillStyle')
		const strokeStyle = node.attr('strokeStyle')
		const isHalf = node.attr('isHalf') === 'true'

		c.lineWidth = 1

		if (isHalf) {

			// fill a half circle
			c.beginPath()
			c.arc(cx, cy, r, 0, π)
			c.fillStyle = fillStyle
			c.fill()
			c.closePath()

			// stroke a circle
			c.beginPath()
			c.arc(cx, cy, r, 0, 2 * π)
			c.strokeStyle = strokeStyle
			c.stroke()
			c.closePath()

		} else {

			// fill and stroke a circle
			c.beginPath()
			c.arc(cx, cy, r, 0, 2 * π)
			c.fillStyle = fillStyle
			c.fill()
			c.strokeStyle = strokeStyle
			c.stroke()
			c.closePath()

		}

	})

}

export default drawCanvas
