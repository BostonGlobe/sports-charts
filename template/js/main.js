import setupIframe from '../../../utils/setup-iframe'

const handleNewData = (data, isChartbuilder) => {

	console.log(data, isChartbuilder)

}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleNewData)
