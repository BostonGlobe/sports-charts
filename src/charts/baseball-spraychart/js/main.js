import getJSON from 'get-json-lite'

import setupIframe from '../../../utils/setup-iframe'

// this gets fired when we fetch data (e.g. during production)
// or when we receive data (e.g. chartbuilder)
function handleDataLoaded(data) {
	console.log(JSON.stringify(data, null, 2))
}

// this gets fired when there is an error fetching data
function handleDataError(error) {
	console.error(error)
}

// this requests json data (e.g. during production)
// getJSON(url, handleDataLoaded, handleDataError)

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data (e.g. chartbuilder)
setupIframe(handleDataLoaded)


