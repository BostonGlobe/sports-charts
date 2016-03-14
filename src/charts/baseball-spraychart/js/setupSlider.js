import { timeFormat } from 'd3-time-format'
import fancySlider from './fancySlider.js'

// create date formatting function
const dateFormat = timeFormat('%b. %e')

const setupSlider = ({ data, uniqueDates, input, labels }) => {

	// get first and last dates
	const firstDate = data[0].gamedate
	const lastDate = data[data.length - 1].gamedate

	const { start, end } = labels

	// update the input date range span elements
	start.innerHTML = dateFormat(firstDate)
	end.innerHTML = dateFormat(lastDate)

	// document.querySelector('.slider-date-ranges .start-date span').innerHTML =
	// 	dateFormat(firstDate)

	// document.querySelector('.slider-date-ranges .end-date span').innerHTML =
	// 	dateFormat(lastDate)

	// set max distance on slider
	input.setAttribute('max', uniqueDates.length)

	// set slider thumb to slider min
	input.value = input.getAttribute('min')

	// turn slider into fancy slider
	fancySlider.init(input)

}

export default setupSlider
