import { timeFormat } from 'd3-time-format'

import fancySlider from './fancySlider.js'
import drawData from './drawData.js'
import setSliderTooltip from './setSliderTooltip.js'

// create date formatting function
const dateFormat = timeFormat('%b. %e')

const setupSlider = ({ data, uniqueDates, input, tooltip, labels,
onInputChange }) => {

	// get first and last dates
	const firstDate = data[0].gamedate
	const lastDate = data[data.length - 1].gamedate

	const { start, end } = labels

	// update the input date range span elements
	start.innerHTML = dateFormat(firstDate)
	end.innerHTML = dateFormat(lastDate)

	// set max distance on slider
	input.setAttribute('max', uniqueDates.length)

	// set slider thumb to slider min
	input.value = input.getAttribute('min')

	// turn slider into fancy slider
	fancySlider.init(input)

	// position the tooltip correctly: at the beginning
	setSliderTooltip({ input, tooltip, time: firstDate, index: 0 })

	// update chart on input change
	input.addEventListener('input', onInputChange)

}

export default setupSlider
