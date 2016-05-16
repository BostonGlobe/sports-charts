function handleSlider(container) {

// 	const tracks = [
// 		'-webkit-slider-runnable-track',
// 	]

// 	const input = container.querySelector('input')
// 	const { value } = input
// 	const min = input.getAttribute('min')
// 	const max = input.getAttribute('max')
// 	const delta = max - min
// 	const { id } = container

// 	// this sets the gradient for one slider to the correct color stops
// 	// needs a prepared <style> tag created by initSliders()
// 	const gradValue = Math.round(100 * (value - min) / delta)
// 	const grad =
// 		`linear-gradient(90deg,#ffa7a7 ${gradValue}%,#ededed ${gradValue}%)`
// 	const rangeSelector = `#${id} input::`

// 	const styleString = tracks.map(t =>
// 		`${rangeSelector}${t}{background: ${grad};}`).join(' ')

// 	document.getElementById(`s${id}`).textContent = styleString

}

function initSlider(container) {

	const { id } = container
	const input = container.querySelector('input')

	// prepare a <style> tag that will be used by handleSlider()
	const st = document.createElement('style')
	st.id = `s${id}`
	document.head.appendChild(st)

	// // add event listeners to sliders
	// input.addEventListener('input', () =>
	// 	handleSlider(container)
	// , false)

	// input.addEventListener('change', () =>
	// 	handleSlider(container)
	// , false)

	// // color slider track with starting value
	// if (input.value * 1) {
	// 	handleSlider(container)
	// }

}

const fancySlider = {
	init: initSlider,
	drawTrack: handleSlider,
}

export default fancySlider
