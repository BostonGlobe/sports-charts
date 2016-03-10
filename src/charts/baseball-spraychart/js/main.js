import setupIframe from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'

// this gets fired when we receive data
function handleDataLoaded(data) {

	$('.chart-container .count span').innerHTML = data.length
	$('.chart-container pre').innerHTML = JSON.stringify(data, null, 2)

}

// this gets fired when there is an error fetching data
function handleDataError(error) {
	console.error(error)
}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleDataLoaded, handleDataError)

