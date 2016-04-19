import { setupIframe } from '../../../utils/setup-iframe'

const handleNewPayload = (payload) => {
	console.log(payload)
	const { rows } = payload
}

setupIframe(handleNewPayload)
