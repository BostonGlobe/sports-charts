// sort by gamedate, ascending
const sortData = (data) =>
	data.map(x => x).sort((a, b) => a.gamedate - b.gamedate)

export default sortData
