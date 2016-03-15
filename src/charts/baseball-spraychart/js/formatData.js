import { timeParse } from 'd3-time-format'

const gameDateParse = timeParse('%Y%m%d')

// convert 'gamedate' to date,
// then sort by gamedate, ascending
const formatData = (data) =>
	data.map(x => ({
		...x,
		gamedate: gameDateParse(x.gamedate),
	}))
	.sort((a, b) => a.gamedate.getTime() - b.gamedate.getTime())

export default formatData
