import getJSON from 'get-json-lite'
import pymIframe from 'pym-iframe-resizer'

const setup = (handleDataLoaded, handleDataError) => {

	const pymChild = pymIframe({})

	// talk to chartifier
	pymChild.onMessage('receive-data', d => handleDataLoaded(JSON.parse(d)))
	pymChild.sendMessage('request-data', true)

	// talk to production
	pymChild.onMessage('receive-data-url', url =>
		getJSON(url, handleDataLoaded, handleDataError))
	pymChild.sendMessage('request-data-url', true)

}

export default setup
