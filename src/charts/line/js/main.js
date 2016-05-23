import { setupIframe } from '../../../utils/setup-iframe'
import chart from './chart.js'

const handleNewPayload = (payload) => {

	chart.setup(payload)

}

const handleEnterView = (payload) => {
	// console.log(JSON.stringify({ handleEnterView: payload }, null, 2))
}

const resizeEvent = (width) => {
	// console.log(JSON.stringify({ resizeEvent: width }, null, 2))
}

setupIframe({ handleNewPayload, handleEnterView, resizeEvent })
