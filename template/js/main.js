import setupIframe from '../../../utils/setup-iframe'

// this gets fired when we receive data or an error
const handleDataLoaded = (err, payload) => {
	console.log(JSON.stringify(payload, null, 2))
}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleDataLoaded)
