import { setupIframe } from '../../../utils/setup-iframe'
import { setup, draw } from './chart.js'

const handleNewPayload = (payload) => {
	console.log(JSON.stringify({ handleNewPayload: payload }, null, 2))
	setup(payload)
}

const handleEnterView = (payload) => {
	console.log(JSON.stringify({ handleEnterView: payload }, null, 2))
	draw(payload)
}

const resizeEvent = (width) => {
	console.log(JSON.stringify({ resizeEvent: width }, null, 2))
}

setupIframe({ handleNewPayload, handleEnterView, resizeEvent })
