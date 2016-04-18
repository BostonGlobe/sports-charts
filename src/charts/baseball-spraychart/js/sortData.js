// sort by gameDateTime, ascending
const sortData = (data) =>
	data.map(x => x).sort((a, b) => a.gameDateTime - b.gameDateTime)

export default sortData
