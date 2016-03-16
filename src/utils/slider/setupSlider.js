import setSliderTooltip from './setSliderTooltip.js'

const setupSlider = ({ container, labels, max }) => {

	const input = container.querySelector('input')

	const { start, end } = labels

	// set date range span elements
	const startSpan = container.querySelector('.dates .start span')
	const endSpan = container.querySelector('.dates .end span')
	startSpan.innerHTML = start
	endSpan.innerHTML = end

	// set max distance on slider
	input.setAttribute('max', max)

	// set slider thumb to slider min
	// eslint-disable-next-line no-param-reassign
	input.value = input.getAttribute('min')

	// position the tooltip correctly: at the beginning
	setSliderTooltip({ container, text: start, index: 0 })

}

export default setupSlider
