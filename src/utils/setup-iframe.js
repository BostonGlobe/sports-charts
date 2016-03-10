import pymIframe from 'pym-iframe-resizer'

const setup = (callback) => {

	const pymChild = pymIframe({})
	pymChild.onMessage('receive-data', j => callback(JSON.parse(j)))
	pymChild.sendMessage('request-data', true)

}

export default setup
