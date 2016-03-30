import setupIframe from '../../../utils/setup-iframe'
import chart from './chart'

chart.setup()

const handleNewData = ({ rows }) => {
	if (rows) chart.updateData({ rows })
}

const handleNewPayload = (payload) => {
	const { rows, metadata, isChartbuilder } = payload
	if (rows) handleNewData({ rows, metadata, isChartbuilder })
}

setupIframe(handleNewPayload)
