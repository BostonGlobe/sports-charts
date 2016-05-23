import { setupIframe } from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'
import chart from './chart.js'

const handleNewPayload = (payload) => {

	$('.chart-container pre').innerHTML =
		JSON.stringify({ handleEnterView: payload }, null, 2)

	const { rows } = payload

	chart.setup({ data: rows })

}

const handleEnterView = (payload) => {

}

const resizeEvent = (width) => {
	console.log(JSON.stringify({ resizeEvent: width }, null, 2))
}

setupIframe({ handleNewPayload, handleEnterView, resizeEvent })
