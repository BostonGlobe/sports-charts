import getJSON from 'get-json-lite'
import pymIframe from 'pym-iframe-resizer'

const setup = ({ handleDataLoaded, transform }) => {

	const pymChild = pymIframe({})

	// send transformed data to chartifier
	pymChild.onMessage('transform-data', d => {
		const json = JSON.parse(d)
		let output
		if (transform) transform(json, (err, result) => output = result)
		else output = json
		pymChild.sendMessage('data-transformed', JSON.stringify(output))
	})

	// talk to chartifier
	pymChild.onMessage('receive-data', d => {
		const json = JSON.parse(d)
		if (transform) transform(json, handleDataLoaded)
		else handleDataLoaded(null, json)
	})

	pymChild.sendMessage('request-data', true)

	// talk to production
	pymChild.onMessage('receive-data-url', url => getJSON(url, handleDataLoaded))
	pymChild.sendMessage('request-data-url', true)

}

export default setup
