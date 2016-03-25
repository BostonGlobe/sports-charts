import setupIframe from '../../../utils/setup-iframe'
import chart from './chart'

chart.setup()

const handleNewData = ({ rows, metadata }) => {
	const { averages } = metadata
	if (rows && averages) chart.updateData({ averages, rows })
}

const handleNewPayload = (payload) => {
	const { rows, metadata, isChartbuilder } = payload
	if (rows) handleNewData({ rows, metadata, isChartbuilder })
}

setupIframe(handleNewPayload)
