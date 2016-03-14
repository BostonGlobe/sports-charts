import { timeFormat } from 'd3-time-format'

// create date formatting function
const dateFormat = timeFormat('%b. %e')

const setSliderTooltip = ({ input, tooltip, time, index }) => {

	const min = +input.getAttribute('min')
	const max = +input.getAttribute('max')

	// set tooltip content
	tooltip.querySelector('span').innerHTML = dateFormat(new Date(time))

	const position = 100*index/(max-min)

	tooltip.style.left = `${position}%`
	tooltip.style.transform = `translateX(-${position}%)`

}

export default setSliderTooltip
