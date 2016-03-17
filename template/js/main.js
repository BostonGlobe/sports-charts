import setupIframe from '../../../utils/setup-iframe'

// this gets fired when we receive data or an error
function handleDataLoaded(err, data) {
	console.log(JSON.stringify(data, null, 2))
}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleDataLoaded)
