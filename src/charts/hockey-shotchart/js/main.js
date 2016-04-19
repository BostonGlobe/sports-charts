import { setupIframe } from '../../../utils/setup-iframe'
import chart from './chart'

chart.setup()

const handleNewData = (rows) => chart.updateData(rows)

const handleNewPayload = (payload) => {
	const { rows } = payload
	if (rows) handleNewData(rows)
}

setupIframe(handleNewPayload)
