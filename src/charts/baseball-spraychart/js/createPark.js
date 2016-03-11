// import { scaleLinear } from 'd3-scale'
const π = Math.PI

export default function createPark({ canvas, parkRadius = 500 }) {

	const width = canvas.getAttribute('innerWidth')
	const height = canvas.getAttribute('innerHeight')

	// const parkScale = scaleLinear()
	// 	.domain([0, parkRadius])
	// 	.range([0, height])

	// const c = canvas.getContext('2d');

	// // draw park
	// c.beginPath()
	// c.moveTo(0, height)
	// c.arc(0, height, height, -π/4, -3*π/4, true)
	// c.lineTo(0, height)
	// c.lineWidth = 0.5
	// c.strokeStyle = 'black'
	// c.stroke()
	// c.fillStyle = 'red'
	// c.fill()

	// // draw inside lines
	// const markers = [100, 200, 300, 400]
	// markers.forEach(m => {
	// 	c.beginPath()
	// 	c.arc(0, height, parkScale(m), -π/4, -3*π/4, true)
	// 	c.lineWidth = 5
	// 	c.strokeStyle = 'black'
	// 	c.stroke()
	// })

}
