import setupIframe from '../../../utils/setup-iframe'
import chart from './chart'

let entered = false
let storedData = {}
chart.setup()

const updateChart = ({ averages, rows }) => {
	chart.updateData({ averages, shots: rows })
}

const handleNewData = ({ averages, rows }, isChartbuilder) => {
	console.log('data')
	const update = isChartbuilder || entered
	if (update && rows) {
		updateChart({ averages, rows })
	} else {
		// save data update for when enter has occured
		storedData = { averages, rows }
	}
}

const handleNewPayload = (err, payload) => {
	if (err) {
		// TODO: better error handling
		console.log("Oops. Look like we couldn't load this chart's data.")
		return
	}

	const { data, hed, isChartbuilder } = payload

	if (hed) document.querySelector('header h1').textContent = hed
	if (data) handleNewData(data, isChartbuilder)

}

const handleEnterView = () => {
	console.log('entered')
	entered = true
	if (storedData.rows) updateChart(storedData)
}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe({ handleNewPayload, handleEnterView })
