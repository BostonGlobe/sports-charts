import uniq from 'lodash.uniq'

// get an array of unique gamedatetime times
const getUniqueDates = (data) =>
	uniq(data.map(x => x.gamedatetime.getTime()))

export default getUniqueDates
