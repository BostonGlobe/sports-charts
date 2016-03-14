import fancySlider from './fancySlider.js'

const setSlider = ({ input, value }) => {

	input.value = value
	fancySlider.drawTrack(input)

}

export default setSlider
