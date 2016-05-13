import 'promis'
import getJSON from 'get-json-lite'
import pymIframe from 'pym-iframe-resizer'
import { parse } from 'query-string'
import { $, addClass, removeClass } from './dom.js'
import convertRows from './convertRows.js'
import decode from './decode.js'

let pymChild = null

const convertPayload = ({ rows, mappings, ...other }) => ({
	...other,
	rows: convertRows({ rows, mappings }),
})

const displayHeader = ({ hed, subhed, subhedExtra = '' }) => {
	const hedEl = $('.chart-top--hed')
	const subhedEl = $('.chart-top--subhed')
	const hide = 'display-none'

	if (hed) {
		hedEl.innerHTML = decode(hed)
		removeClass(hedEl, hide)
	} else {
		addClass(hedEl, hide)
	}

	if (subhed) {
		subhedEl.innerHTML = `${decode(subhed)}${decode(subhedExtra)}`
		removeClass(subhedEl, hide)
	} else {
		addClass(subhedEl, hide)
	}
}

const addSportClass = ({ sport }) => {
	addClass($('#globe-graphic-container > .chart'), `chart--${sport}`)
}

const showChartVersion = () => {
	removeClass($('.chart-version'), 'display-none')
}

const addMetaInfo = ({ payloadLength = '', payloadLengthGzipped = '' }) => {
	$('.chart-version .meta-info').innerHTML =
		` / ${payloadLength} / ${payloadLengthGzipped}`
}

const chartbuilder = ({ handleNewPayload, handleEnterView }) => {
	showChartVersion()
	// listen to chartifier for data
	pymChild.onMessage('receive-data', d => {
		const data = { ...JSON.parse(d), isChartbuilder: true }
		const payload = convertPayload(data)
		addMetaInfo(payload)
		displayHeader(payload)
		addSportClass(payload)
		handleNewPayload(payload)
		handleEnterView(payload)
	})
	pymChild.sendMessage('request-data', true)
}

const dev = ({ handleNewPayload, handleEnterView }) => {
	showChartVersion()
	const enterViewPromise = new Promise((resolve) =>
		pymChild.onMessage('enter-view', resolve)
	)
	const handleNewPayloadPromise = new Promise((resolve) =>
		pymChild.onMessage('receive-data', d => {
			const data = JSON.parse(d)._source.payload
			const payload = convertPayload(data)
			addMetaInfo(payload)
			displayHeader(payload)
			addSportClass(payload)
			handleNewPayload(payload)
			resolve(payload)
		})
	)

	Promise.all([enterViewPromise, handleNewPayloadPromise])
		.then(value => handleEnterView(value.pop()))
		.catch(err => console.error(err))

	pymChild.sendMessage('request-data', true)
}

const prod = ({ handleNewPayload, handleEnterView }) => {
	const enterViewPromise = new Promise((resolve) =>
		pymChild.onMessage('enter-view', resolve)
	)
	const handleNewPayloadPromise = new Promise((resolve) =>
		pymChild.onMessage('receive-data-url', url =>
			getJSON(url, (err, json) => {
				const data = json._source.payload
				const payload = convertPayload(data)
				displayHeader(payload)
				addSportClass(payload)
				handleNewPayload(payload)
				resolve(payload)
			})
		)
	)

	Promise.all([enterViewPromise, handleNewPayloadPromise])
		.then(value => handleEnterView(value.pop()))
		.catch(err => console.error(err))

	pymChild.sendMessage('request-data-url', true)
}

// setupIframe will take an object of functions:
// handleNewPayload will get fired immediately on new data
// handleEnterView will get fired when enter view happens
const setupIframe = ({ handleNewPayload, handleEnterView }) => {

	pymChild = pymIframe({})

	// determine environment (chartbuilder, dev, prod [default])
	const parsed = parse(window.location.search)
	const env = parsed.env || 'prod'

	const options = { chartbuilder, dev, prod }
	options[env]({ handleNewPayload, handleEnterView })
}

const track = value => {
	if (pymChild) pymChild.sendMessage('omniture-track', value)
}

export { setupIframe, track }
