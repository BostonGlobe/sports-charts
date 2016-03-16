import fancySlider from './fancySlider.js'

const setSlider = ({ container, value }) => {

	const input = container.querySelector('input')
	input.value = value

	fancySlider.drawTrack(container)

}

export default setSlider
