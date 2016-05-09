const options = [

	{
		_type: 'baseball-season-pitchers',
		key: 'era',
		format: 'ERA',
	},
	{
		_type: 'baseball-season-pitchers',
		key: 'walksAndHitsPerInningPct',
		format: 'WHIP',
	},
	{
		_type: 'baseball-season-pitchers',
		key: 'strikeoutsPerNine',
		format: 'K/9',
	},

	{
		_type: 'baseball-season-batters',
		key: 'avg',
		format: 'Avg',
	},
	{
		_type: 'baseball-season-batters',
		key: 'obp',
		format: 'OBP',
	},
	{
		_type: 'baseball-season-batters',
		key: 'ops',
		format: 'OPS',
	},

]

export default ({ key, _type }) => {

	const result = options
		.filter(f => f._type === _type && f.key === key)
		.concat({ format: key })

	return result[0].format

}

