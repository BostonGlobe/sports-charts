import getJSON from 'get-json-lite'
import pymIframe from 'pym-iframe-resizer'

const setup = ({ handleNewPayload, handleEnterView }) => {

	const pymChild = pymIframe({})

	// talk to chartifier
	pymChild.onMessage('receive-data', d =>
		handleNewPayload(null, JSON.parse(d)))
	pymChild.sendMessage('request-data', true)

	// talk to production
	pymChild.onMessage('receive-data-url', url =>
		getJSON(url, handleNewPayload))
	pymChild.sendMessage('request-data-url', true)

	// handle iframe entering view
	pymChild.onMessage('enter-view', handleEnterView)

}

export default setup
