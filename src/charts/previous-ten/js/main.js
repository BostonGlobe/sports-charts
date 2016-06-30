import { setupIframe } from '../../../utils/setup-iframe'
import chart from './chart'

const handleNewData = (rows) => chart.updateData(rows)

const handleNewPayload = (payload) => {
	const { rows } = payload
	if (rows && rows.length) handleNewData(rows)
}

const handleEnterView = () => {
}

setupIframe({ handleNewPayload, handleEnterView })
