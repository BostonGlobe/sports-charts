const dimensions = {
	left: -25,
	right: 25,
	top: -5.25,
	bottom: 41.75,
}

const binRatio = 1 / 40
const minHexRadius = 2

const distanceBinSize = 4
const maxDistanceBin = Math.floor(32 / distanceBinSize)

export { dimensions, binRatio, binRatio, distanceBinSize, maxDistanceBin, minHexRadius }
