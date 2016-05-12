import { setupIframe } from '../../../utils/setup-iframe'
import chart from './chart'

const handleNewPayload = () => chart.setup()

const handleEnterView = (payload) => {
	const { rows, isChartbuilder } = payload
	if (rows) chart.updateData({ rows, isChartbuilder: true })
}

setupIframe({ handleNewPayload, handleEnterView })
