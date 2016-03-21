import setupIframe from '../../../utils/setup-iframe'
import chart from './chart'

chart.setup()

// this gets fired when we receive data
function handleDataLoaded(err, data) {
	if (err) console.log(err)
	else chart.updateData(data)
}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleDataLoaded)
