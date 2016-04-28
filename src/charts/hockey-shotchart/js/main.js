import { setupIframe } from '../../../utils/setup-iframe'
import chart from './chart'

const handleNewPayload = () => chart.setup()

const handleEnterView = (payload) => {
	const { rows } = payload
	if (rows) chart.updateData(rows)
}

setupIframe({ handleNewPayload, handleEnterView })
