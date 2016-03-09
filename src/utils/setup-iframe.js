import pymIframe from 'pym-iframe-resizer'

export default function (cb) {
	pymIframe.resizer()
	const pymChild = pymIframe.getPymChild()
	pymChild.sendMessage('req-data-source', true)
	pymChild.onMessage('res-data-source', cb)
}
