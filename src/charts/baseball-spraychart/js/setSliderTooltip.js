import { timeFormat } from 'd3-time-format'

// create date formatting function
const dateFormat = timeFormat('%b. %e')

const setSliderTooltip = ({ input, tooltip, time, index }) => {

	const min = +input.getAttribute('min')
	const max = +input.getAttribute('max')

	// set tooltip content
	// eslint-disable-next-line no-param-reassign
	tooltip.querySelector('span').innerHTML = dateFormat(new Date(time))

	const position = 100 * index / (max - min)

	// eslint-disable-next-line no-param-reassign
	tooltip.style.left = `${position}%`

	// eslint-disable-next-line no-param-reassign
	tooltip.style.transform = `translateX(-${position}%)`

}

export default setSliderTooltip
