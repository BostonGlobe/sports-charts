import getJSON from 'get-json-lite'
import pymIframe from 'pym-iframe-resizer'
import { parse } from 'query-string'
import 'promis'

const chartbuilder = ({ pymChild, handleNewPayload }) => {
	// listen to chartifier for data
	pymChild.onMessage('receive-data', d => {
		const data = { ...JSON.parse(d), isChartbuilder: true }
		handleNewPayload(data)
	})
	pymChild.sendMessage('request-data', true)
}

const dev = ({ pymChild, handleNewPayload }) => {
	const enterViewPromise = new Promise((resolve) =>
		pymChild.onMessage('enter-view', resolve)
	)
	const handleNewPayloadPromise = new Promise((resolve) =>
		pymChild.onMessage('receive-data', d => resolve(JSON.parse(d)))
	)

	Promise.all([enterViewPromise, handleNewPayloadPromise])
		.then(value => handleNewPayload(value.pop()))
		.catch(err => console.error(err))

	pymChild.sendMessage('request-data', true)
}

const prod = ({ pymChild, handleNewPayload }) => {
	const enterViewPromise = new Promise((resolve) =>
		pymChild.onMessage('enter-view', resolve)
	)
	const handleNewPayloadPromise = new Promise((resolve) =>
		pymChild.onMessage('receive-data-url', url => {
			getJSON(url, (err, response) => {
				resolve(response)
			})
		})
	)

	Promise.all([enterViewPromise, handleNewPayloadPromise])
		.then(value => handleNewPayload(value.pop()))
		.catch(err => console.error(err))

	pymChild.sendMessage('request-data-url', true)
}

const setup = handleNewPayload => {

	const pymChild = pymIframe({})

	// determine environment (chartbuilder, dev, prod [default])
	const parsed = parse(window.location.search)
	const env = parsed.env || 'prod'

	const options = { chartbuilder, dev, prod }
	options[env]({ pymChild, handleNewPayload })
}

export default setup
