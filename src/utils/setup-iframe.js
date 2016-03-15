import getJSON from 'get-json-lite'
import pymIframe from 'pym-iframe-resizer'

const setup = ({ handleDataLoaded, transform = (d, c) => c(null, d) }) => {

	const pymChild = pymIframe({})

	// send transformed data to chartifier
	pymChild.onMessage('transform-data', d => {
		const json = JSON.parse(d)
		transform(json, (err, result) =>
			pymChild.sendMessage('data-transformed', JSON.stringify(result)))
	})

	// talk to chartifier
	pymChild.onMessage('receive-data', d => {
		const json = JSON.parse(d)
		transform(json, handleDataLoaded)
	})

	pymChild.sendMessage('request-data', true)

	// talk to production
	pymChild.onMessage('receive-data-url', url =>
		getJSON(url, handleDataLoaded))
	pymChild.sendMessage('request-data-url', true)

}

export default setup
