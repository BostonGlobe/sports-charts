import getJSON from 'get-json-lite'
import pymIframe from 'pym-iframe-resizer'
import { parse } from 'query-string'

const chartbuilder = ({ pymChild, handleNewPayload }) => {
	// listen to chartifier for data
	pymChild.onMessage('receive-data', d => {
		const data = { ...d, isChartbuilder: true }
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

const setup = ({ handleNewPayload }) => {

	const pymChild = pymIframe({})

	// determine environment (chartbuilder, dev, prod [default])
	const parsed = parse(window.location.search)
	const env = parsed.env || 'prod'

	if (env === 'chartbuilder') chartbuilder({ pymChild, handleNewPayload })
	else if (env === 'dev') dev({ pymChild, handleNewPayload })
	else prod({ pymChild, handleNewPayload })

}

export default setup
