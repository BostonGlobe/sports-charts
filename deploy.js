/*
	node deploy.js -u username (-v [patch | minor | major]
*/

const shell = require('shelljs')
const fs = require('fs')
const argv = require('yargs').argv
const username = argv.u
const version = argv.v || 'patch'

function displayUploadScript(charts) {
	const files = (c) =>
		`charts/${c}/index.html charts/${c}/bundle.css charts/${c}/main.js charts/${c}/main.js.map`
	const command = `
		upload ${charts.map(files).join(' ')} chart-base.css chart-base.js
	`.trim()
	console.log('\n-- upload command --')
	console.log(command)
	shell.exec(`echo "${command}" | pbcopy`)
}

function runProdScripts() {
	shell.exec(`npm version ${version.trim()}`)
	shell.exec('git push')
	shell.exec(`gulp prod-base -u ${username}`)

	const charts = fs.readdirSync('src/charts')
	const command = charts.map(c => `gulp prod --chart ${c} -u ${username.trim()}`).join(';')

	console.log('\n-- prod command --')
	console.log(command)
	shell.exec(command, () => displayUploadScript(charts))
}

if (username) runProdScripts()
else console.log('** provide a username **')
