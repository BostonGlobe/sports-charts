const dimensions = {
	left: -25,
	right: 25,
	top: -5.25,
	bottom: 41.75,
}

const binRatio = 1 / 25
const radiusRangeFactors = [0.25, 0.5, 0.75, 1]

const distanceBinSize = 4
const maxDistanceBin = Math.floor(32 / distanceBinSize)

const percentRange = 15

// 1
// const colors = [
// 	'#7EF183',
// 	'#02C664',
// 	'#008048',
// ]
// const strokes = [
// 	'none',
// 	'none',
// 	'none',
// ]

// // 2
// const colors = [
// 	'transparent',
// 	'#02C664',
// 	'#008048',
// ]
// const strokes = [
// 	'008048',
// 	'none',
// 	'none',
// ]

// 3
const colors = [
	'#67a9cf',
	'#ccc',
	'#ef8a62',
	// 'blue',
	// '#ccc',
	// 'red',
]

const strokes = [
	'none',
	'none',
	'none',
]

export { dimensions, binRatio, binRatio, distanceBinSize, maxDistanceBin, colors, strokes, radiusRangeFactors, percentRange }
