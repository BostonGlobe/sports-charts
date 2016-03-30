import setupIframe from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'
import { timeParse, timeFormat } from 'd3-time-format'

const dateParse = timeParse('%Y%m%d')
const dateFormat = timeFormat('%b. %e')

const handleNewPayload = ({ rows, team, isChartbuilder }) => {

	console.log(rows)

	const games = rows.map(r => ({
			...r,
			won: r.outcome.split(', ')[0],
			score: r.outcome.split(', ')[1],
			gamedate: dateFormat(dateParse(r.gamedate)),
		}))
		.sort((a, b) => a < b)
		.map(r => `
			<tr>
				<td>${r.won}</td>
				<td>${r.score}</td>
				<td>${r.opp}</td>
				<td>${r.gamedate}</td>
			</tr>
			`
		)

	const table = `
		<table summary='A table that has win/loss, score, opponent team, and game date across the top and the previous ${rows.length} games for the ${team}'>
			<thead>
				<tr>
					<th scope='col'>Win/loss</th>
					<th scope='col'>Score</th>
					<th scope='col'>Opponent</th>
					<th scope='col'>Date</th>
				</tr>
			</thead>
			<tbody>
				${games.join('')}
			</tbody>
		</table>
	`

	$('.chart-container').innerHTML = table

}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleNewPayload)
