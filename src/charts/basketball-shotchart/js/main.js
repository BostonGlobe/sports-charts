import setupIframe from '../../../utils/setup-iframe'
import chart from './chart'

chart.setup()

const handleNewData = ({ rows, metadata }) => {
	if (rows) chart.updateData({ averages: metadata, rows })
}

const handleNewPayload = (payload) => {
	const { rows, metadata, hed, isChartbuilder } = payload

	if (hed) document.querySelector('header h1').textContent = hed
	if (rows) handleNewData({ rows, metadata, isChartbuilder })

}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe({ handleNewPayload })
