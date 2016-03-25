import setupIframe from '../../../utils/setup-iframe'

const handleNewPayload = (payload) => {
	console.log(payload)
}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleNewPayload)
