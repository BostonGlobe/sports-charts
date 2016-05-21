import { setupIframe } from '../../../utils/setup-iframe'

const handleNewPayload = (payload) => {
	console.log(JSON.stringify({ handleNewPayload: payload }, null, 2))
}

const handleEnterView = (payload) => {
	console.log(JSON.stringify({ handleEnterView: payload }, null, 2))
}

const resizeEvent = (width) => {
	console.log(JSON.stringify({ resizeEvent: width }, null, 2))
}

setupIframe({ handleNewPayload, handleEnterView, resizeEvent })
