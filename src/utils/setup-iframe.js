import 'promis'
import getJSON from 'get-json-lite'
import pymIframe from 'pym-iframe-resizer'
import { parse } from 'query-string'
import { $, addClass, removeClass } from './dom'
import convertRows from './convertRows'

let pymChild = null

const convertPayload = ({ rows, mappings, ...other }) => ({
	...other,
	rows: convertRows({ rows, mappings }),
})

const displayHeader = ({ hed, subhed }) => {
	if (hed) {
		$('.chart-top--hed').textContent = hed
		removeClass($('.chart-top--hed'), 'display-none')
	} else {
		addClass($('.chart-top--hed'), 'display-none')
	}

	if (subhed) {
		$('.chart-top--subhed').textContent = subhed
		removeClass($('.chart-top--subhed'), 'display-none')
	} 
	else {
		addClass($('.chart-top--subhed'), 'display-none')	
	}
}

const addSportClass = ({ sport }) => {
	addClass($('main'), `chart--${sport}`)
}

const chartbuilder = handleNewPayload => {
	// listen to chartifier for data
	pymChild.onMessage('receive-data', d => {
		const data = { ...JSON.parse(d), isChartbuilder: true }
		displayHeader(data)
		addSportClass(data)
		handleNewPayload(convertPayload(data))
	})
	pymChild.sendMessage('request-data', true)
}

const dev = handleNewPayload => {
	const enterViewPromise = new Promise((resolve) =>
		pymChild.onMessage('enter-view', resolve)
	)
	const handleNewPayloadPromise = new Promise((resolve) =>
		pymChild.onMessage('receive-data', d => {
			const data = JSON.parse(d)
			displayHeader(data)
			addSportClass(data)
			resolve(data)
		})
	)

	Promise.all([enterViewPromise, handleNewPayloadPromise])
		.then(value => handleNewPayload(convertPayload(value.pop())))
		.catch(err => console.error(err))

	pymChild.sendMessage('request-data', true)
}

const prod = handleNewPayload => {
	const enterViewPromise = new Promise((resolve) =>
		pymChild.onMessage('enter-view', resolve)
	)
	const handleNewPayloadPromise = new Promise((resolve) =>
		pymChild.onMessage('receive-data-url', url =>
			getJSON(url, (err, data) => {
				displayHeader(data)
				addSportClass(data)
				resolve(data)
			})
		)
	)

	Promise.all([enterViewPromise, handleNewPayloadPromise])
		.then(value => handleNewPayload(convertPayload(value.pop())))
		.catch(err => console.error(err))

	pymChild.sendMessage('request-data-url', true)
}

const setupIframe = handleNewPayload => {

	pymChild = pymIframe({})

	// determine environment (chartbuilder, dev, prod [default])
	const parsed = parse(window.location.search)
	const env = parsed.env || 'prod'

	const options = { chartbuilder, dev, prod }
	options[env](handleNewPayload)
}

const track = value => {
	if (pymChild) pymChild.sendMessage('omniture-track', value)
}

export { setupIframe, track }
