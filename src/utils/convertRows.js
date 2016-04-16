import mapValues from 'lodash.mapvalues'

const options = {
	boolean: Boolean,
	integer: Number,
	float: Number,
	object: Object,
	date: (x) => new Date(x),
	string: (x) => x.toString(),
}

export default ({ rows, mappings }) =>
	rows.map(row => mapValues(row, (value, key) =>
		options[mappings[key] || 'string'](value)))
