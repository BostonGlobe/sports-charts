function initSlider(input) {

	// prepare a <style> tag that will be used by handleSlider()
	var st = document.createElement('style')
	st.id = 's' + input.id
	document.head.appendChild(st)

	// add event listeners to sliders
	input.addEventListener('input', function () {
		handleSlider(this)
	}, false)

	input.addEventListener('change', function () {
		handleSlider(this)
	}, false)

	// color slider track with starting value
	if (input.value*1) {
		handleSlider(input)
	}

}

function handleSlider(input) {

	var tracks = [
		'-webkit-slider-runnable-track',
	]

	// this sets the gradient for one slider to the correct color stops
	// needs a prepared <style> tag created by initSliders()
	var gradValue = Math.round((input.value/input.getAttribute('max')*1)*100)
	var grad = 'linear-gradient(90deg,#ffa7a7 ' + gradValue + '%,#ededed ' + (gradValue+1) + '%)'
	var rangeSelector = 'input[id='+input.id+']::'
	var styleString = ''

	for (var j=0;j<tracks.length;j+=1) {
		styleString += rangeSelector + tracks[j] + '{background: ' + grad + ';} '
	}
	document.getElementById('s'+input.id).textContent = styleString
}

const fancySlider = {
	init: initSlider,
	drawTrack: handleSlider
}

export default fancySlider
