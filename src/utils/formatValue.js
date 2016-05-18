import { format } from 'd3-format'

const options = [

	{
		_type: 'baseball-season-pitchers',
		key: 'era',
		format: (n) => format('.2f')(n),
	},
	{
		_type: 'baseball-season-pitchers',
		key: 'walksAndHitsPerInningPct',
		format: (n) => format('.2f')(n),
	},
	{
		_type: 'baseball-season-pitchers',
		key: 'strikeoutsPerNine',
		format: (n) => format('.1f')(n),
	},

	{
		_type: 'baseball-season-batters',
		key: 'avg',
		format: (n) => format('.3f')(n).replace(/^0\./, '.'),
	},
	{
		_type: 'baseball-season-batters',
		key: 'obp',
		format: (n) => format('.3f')(n).replace(/^0\./, '.'),
	},
	{
		_type: 'baseball-season-batters',
		key: 'ops',
		format: (n) => format('.3f')(n).replace(/^0\./, '.'),
	},

]

export default ({ key, value, _type }) => {

	const result = options
		.filter(f => f._type === _type && f.key === key)
		.concat({ format: d => d })

	return result[0].format(value)

}
