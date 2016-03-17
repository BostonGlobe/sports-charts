const dimensions = {
	left: -25,
	right: 25,
	top: -5.25,
	bottom: 41.75,
}

const binRatio = 1 / 37.5
const radiusRangeFactors = [0.25, 0.5, 0.75, 1]

const distanceBinSize = 4
const maxDistanceBin = Math.floor(32 / distanceBinSize)

const percentRange = 15

const colorClasses = ['below', 'average', 'above']

export {
	dimensions,
	binRatio,
	distanceBinSize,
	maxDistanceBin,
	radiusRangeFactors,
	percentRange,
	colorClasses,
}
