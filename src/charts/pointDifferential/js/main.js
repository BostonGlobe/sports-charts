import setupIframe from '../../../utils/setup-iframe'

const handleNewHed = (hed) =>
	document.querySelector('header span').textContent = hed

const handleNewData = (data) => {

	console.log(data)

}

// this gets fired when we receive data
const handleDataLoaded = (err, payload) => {

	if (err) {
		// TODO: better error handling
		console.log("Oops. Look like we couldn't load this chart's data.")
		return
	}

	const { hed, data, isChartbuilder } = payload
	if (hed) handleNewHed(hed)
	if (data) handleNewData(data, isChartbuilder)

}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleDataLoaded)
