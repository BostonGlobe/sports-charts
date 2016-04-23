import fancySlider from './fancySlider.js'

const createSlider = ({ container, onInput }) => {

	// eslint-disable-next-line no-param-reassign
	container.innerHTML = `
		<div class='tooltip-wrapper'>
			&nbsp;
			<div class='tooltip'>
				<span></span>
			</div>
		</div>
		<input type='range' min='1' step='1'></input>
		<div class='dates'>
			<div class='start'><span></span></div>
			<div class='end'><span></span></div>
		</div>
	`

	const input = container.querySelector('input')

	input.addEventListener('input', onInput)

	// turn slider into fancy slider
	fancySlider.init(container)

	return input

}

export default createSlider
