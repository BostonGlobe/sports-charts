import setupIframe from '../../../utils/setup-iframe'
import chart from './chart'
import transform from './transform'

chart.setup()

// this gets fired when we receive data
function handleDataLoaded(data) {
	chart.updateData(data)
}

// this gets fired when there is an error fetching data
function handleDataError(error) {
	console.error(error)
}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe({ handleDataLoaded, handleDataError, transform })
