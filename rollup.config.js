// import babel from 'rollup-plugin-babel'
// import { rollup } from 'rollup'

var babel = require('rollup-plugin-babel')
var nodeResolve = require('rollup-plugin-node-resolve')
var rollup = require('rollup').rollup
var commonjs = require('rollup-plugin-commonjs')

// export default {
// 	entry: './src/charts/baseball-spraychart/js/main.js',
// 	plugins: [ babel({
// 		exclude: 'node_modules/**',
// 	}) ],
// }



rollup({
	entry: './src/charts/baseball-spraychart/js/main.js',
  plugins: [

    nodeResolve({
      // use "jsnext:main" if possible
      // – see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true,

      // use "main" field or index.js, even if it's not an ES6 module
      // (needs to be converted from CommonJS to ES6
      // – see https://github.com/rollup/rollup-plugin-commonjs
      // main: true,

      // // if there's something your bundle requires that you DON'T
      // // want to include, add it to 'skip'
      // skip: [ 'some-big-dependency' ],

      // some package.json files have a `browser` field which
      // specifies alternative files to load for people bundling
      // for the browser. If that's you, use this option, otherwise
      // pkg.browser will be ignored
      // browser: true,

      // not all files you want to resolve are .js files
      // extensions: [ '.js', '.json' ],

      // whether to prefer built-in modules (e.g. `fs`, `path`) or
      // local ones with the same names
      // preferBuiltins: false
    }),

    commonjs(),

		babel({
		}),

  ]
}).then( bundle => {
	console.log('asdf')
	bundle.write({ dest: 'gabriel.js', format: 'iife' })
})
.catch( function ( err ) { console.log( err ); })
// // alongside rollup-plugin-commonjs, for using non-ES6 third party modules
// import commonjs from 'rollup-plugin-commonjs';

// rollup({
//   entry: 'main.js',
//   plugins: [
//     nodeResolve({ jsnext: true, main: true }),
//     commonjs()
//   ]
// }).then( bundle => bundle.write({ dest: 'bundle.js', format: 'iife' }) );