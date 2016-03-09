const webpack = require('webpack')

const devExports = require('./webpack.config.dev.js')

module.exports = {
	module: devExports,
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
	],
}
