function handleSlider(input) {

	const tracks = [
		'-webkit-slider-runnable-track',
	]

	const { value } = input
	const min = input.getAttribute('min')
	const max = input.getAttribute('max')
	const delta = max - min

	// this sets the gradient for one slider to the correct color stops
	// needs a prepared <style> tag created by initSliders()
	const gradValue = Math.round(100 * (value - min) / delta)
	const grad = `linear-gradient(90deg,#ffa7a7 ${gradValue}%,#ededed ${gradValue}%)`
	const rangeSelector = `input[id=${input.id}]::`

	const styleString = tracks.map(t =>
		`${rangeSelector}${t}{background: ${grad};}`).join(' ')

	document.getElementById(`s${input.id}`).textContent = styleString
}

function initSlider(input) {

	// prepare a <style> tag that will be used by handleSlider()
	const st = document.createElement('style')
	st.id = `s${input.id}`
	document.head.appendChild(st)

	// add event listeners to sliders
	input.addEventListener('input', function onInput() {
		handleSlider(this)
	}, false)

	input.addEventListener('change', function onChange() {
		handleSlider(this)
	}, false)

	// color slider track with starting value
	if (input.value * 1) {
		handleSlider(input)
	}

}

const fancySlider = {
	init: initSlider,
	drawTrack: handleSlider,
}

export default fancySlider
