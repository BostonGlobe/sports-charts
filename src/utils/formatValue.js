import { format } from 'd3-format'

const options = [
	{
		_type: 'baseball-spraychart',
		key: 'balls',
		format: '.3f',
	}
]

export default ({ key, value, _type }) => {

	const result = options
		.filter(f => f._type === _type && f.key === key)
		.concat({ format: '' })

	return format(result[0].format)(value)

}
