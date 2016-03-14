import uniq from 'lodash.uniq'

// get an array of unique gamedate times
const getUniqueDates = (data) =>
	uniq(data.map(x => x.gamedate.getTime()))

export default getUniqueDates
