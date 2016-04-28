const options = [
	{
		_type: 'baseball-spraychart',
		key: 'balls',
		format: 'balls hit',
	},
	{
		_type: 'baseball-spraychart',
		key: 'outs',
		format: 'outs per % by 9',
	},
]

export default ({ key, _type }) => {

	const result = options
		.filter(f => f._type === _type && f.key === key)
		.concat({ format: key })

	return result[0].format

}

