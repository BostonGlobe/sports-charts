import { select } from 'd3-selection'

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

	dataContainer.selectAll('custom.rect').each(function draw() {

		const node = select(this)
		const x = node.attr('x')
		const y = node.attr('y')
		const w = node.attr('width')
		const h = node.attr('height')
		const fill = node.attr('fill')

		c.fillStyle = fill
		c.fillRect(x, y, w, h)

	})

}

export default drawCanvas
