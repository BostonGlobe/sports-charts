/*	
	node deploy.js -u username (-v [patch | minor | major]
*/

const shell = require('shelljs')
const argv = require('yargs').argv
const username = argv.u
const version = argv.v || 'patch'

function displayUploadScript() {
	// const command = races.map(r => `${r.raceType.toLowerCase()}/${r.party.toLowerCase()}/${standardize.expandState(r.stateAbbr).toLowerCase().split(' ').join('-')}/index.html`).join(' ')

	// console.log('\n-- upload command --')
	// console.log(`upload ${command}`)
	// shell.exec(`echo "upload ${command}" | pbcopy`)
}

function runProdScripts() {
	shell.exec(`npm version ${version.trim()}`)
	// shell.exec('rm dist/chart-base.css')
	// shell.exec('gulp css-base-prod')
	
	// const charts = fs.readdirSync('src/charts')
	// const command = charts.map(c => `gulp prod --chart ${c} -u ${username.trim()}`).join(';')

	// console.log('\n-- prod command --')
	// console.log(command)
	// shell.exec(command, displayUploadScript);
	// displayUploadScript()
}

if (username) runProdScripts()
else console.log('** provide a username **')
