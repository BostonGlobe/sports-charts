import setupIframe from '../../../utils/setup-iframe'
import getJSON from 'get-json-lite'

function handleDataLoaded(data) {

}

function handleDataError(error) {
	console.error(error)
}

function fetchData(source) {
	getJSON(source, handleDataLoaded, handleDataError)
}

setupIframe(fetchData)
