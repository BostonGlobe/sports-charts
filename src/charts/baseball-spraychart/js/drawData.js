import { select, selectAll } from 'd3-selection'

const π = Math.PI

const drawData = ({ data, detachedContainer, scales }) => {

	const { x, y } = scales

	// // get canvas context
	// const c = canvas.getContext('2d')

	// // create arc generator
	// const arcGenerator = arc()
	// 	.innerRadius(0)
	// 	.outerRadius(d => d)
	// 	.startAngle(0)
	// 	.endAngle(2*π)
	// 	.context(c)

	// data = [0, 25, 50]

	// get the custom data container
	const dataContainer = select(detachedContainer);

	// JOIN
	const circles = dataContainer.selectAll('custom.circle')
		.data(data, d => d.index)

	// EXIT
	circles.exit().remove()

	// UPDATE
	// circles.attr(...)

	// ENTER
	circles.enter().append('custom')
		.attr('class', 'circle')
		.attr('cx', x)
		.attr('cy', y)
		.attr('r', d => d.description === 'Home run' ? 5 : 3)

	// // const circles = svg.select('g.root')
	// // 	.append('g').selectAll('.circle').data([0, 1, 2])

	// // circles.enter().append('path')
	// // 	.attr('d', arcGenerator)
	// // 	.attr('transform', d => `translate(0, ${d * -50})`)
	// // 	.style('fill', 'red')

	// // data.forEach((d, i) => {
	// // 	c.beginPath()
	// // 	arcGenerator(d)
	// // 	c.strokeStyle = 'red'
	// // 	c.stroke()
	// // })









}

export default drawData
