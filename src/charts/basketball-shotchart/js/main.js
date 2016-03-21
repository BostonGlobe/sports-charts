import setupIframe from '../../../utils/setup-iframe'
import chart from './chart'

chart.setup()

const handleNewData = (data, isChartbuilder) => {

	chart.updateData(data)

}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleNewData)
