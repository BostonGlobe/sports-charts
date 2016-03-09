module.exports = {
	module: {
		loaders: [
			{ test: /\.csv?$/, loader: 'dsv-loader' },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
		],
	},
}
