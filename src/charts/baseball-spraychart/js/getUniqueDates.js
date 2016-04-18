import uniq from 'lodash.uniq'

// get an array of unique gameDateTime times
const getUniqueDates = (data) =>
	uniq(data.map(x => x.gameDateTime.getTime()))

export default getUniqueDates
