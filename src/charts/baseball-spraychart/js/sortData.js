// sort by gamedatetime, ascending
const sortData = (data) =>
	data.map(x => x).sort((a, b) => a.gamedatetime - b.gamedatetime)

export default sortData
