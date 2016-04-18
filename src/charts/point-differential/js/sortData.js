// sort by gameDateTime, ascending
export default (data) =>
	data.map(x => x).sort((a, b) => a.gameDate - b.gameDate)

