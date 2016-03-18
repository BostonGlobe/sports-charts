import getJSON from 'get-json-lite'
import pymIframe from 'pym-iframe-resizer'

const setup = (handleNewData) => {

	const handleDataLoaded = (err, payload) => {

		if (err) {
			// TODO: better error handling
			console.log("Oops. Look like we couldn't load this chart's data.")
			return
		}

		const { hed, data, isChartbuilder } = payload

		if (hed) document.querySelector('header h1').textContent = hed
		if (data) handleNewData(data, isChartbuilder)

	}

	const pymChild = pymIframe({})

	// talk to chartifier
	pymChild.onMessage('receive-data', d =>
		handleDataLoaded(null, JSON.parse(d)))
	pymChild.sendMessage('request-data', true)

	// talk to production
	pymChild.onMessage('receive-data-url', url =>
		getJSON(url, handleDataLoaded))
	pymChild.sendMessage('request-data-url', true)

}

export default setup
