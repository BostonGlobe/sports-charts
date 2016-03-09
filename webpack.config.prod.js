module.exports = {
	module: {
		loaders: [
            { test: /\.csv?$/, loader: 'dsv-loader' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/,
				query: { presets: ['es2015'] },
            },
		],
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
	]
}
