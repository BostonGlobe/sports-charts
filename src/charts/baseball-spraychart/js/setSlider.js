import fancySlider from './fancySlider.js'

const setSlider = ({ input, value }) => {

	// eslint-disable-next-line no-param-reassign
	input.value = value
	fancySlider.drawTrack(input)

}

export default setSlider
