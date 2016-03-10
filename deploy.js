/*
	node deploy.js -u username (-v [patch | minor | major]
*/

const shell = require('shelljs')
const fs = require('fs')
const argv = require('yargs').argv
const username = argv.u
const version = argv.v || 'patch'

function displayUploadScript(charts) {
	const createFileString = (c) => `chart/${c}/index.html chart/${c}/bundle.css chart/${c}/bundle.js`
	const command = `
		upload ${charts.map(createFileString).join(' ')} chart-base.css
	`.trim()
	console.log('\n-- upload command --')
	console.log(command)
	// shell.exec(`echo "${command}" | pbcopy`)
}

function runProdScripts() {
	// shell.exec(`npm version ${version.trim()}`)
	// shell.exec('git push')
	shell.exec('rm dist/chart-base.css')
	shell.exec('gulp css-base-prod')

	const charts = fs.readdirSync('src/charts')
	const command = charts.map(c => `gulp prod --chart ${c} -u ${username.trim()}`).join(';')

	console.log('\n-- prod command --')
	console.log(command)
	// shell.exec(command, () => displayUploadScript(charts))
	displayUploadScript(charts)
}

if (username) runProdScripts()
else console.log('** provide a username **')
