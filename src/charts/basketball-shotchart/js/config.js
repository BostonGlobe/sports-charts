const dimensions = { left: -25, right: 25, top: -5.25, bottom: 41.75 }
const binRatio = 1 / 30
const transitionDuration = 1000
const delayRange = [transitionDuration * 2, transitionDuration, 0]
const percentRange = 12
const colorClasses = ['below', 'average', 'above']
const minShotsThreshold = 2

export {
	dimensions,
	binRatio,
	delayRange,
	transitionDuration,
	percentRange,
	colorClasses,
	minShotsThreshold,
}
