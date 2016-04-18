import { $ } from '../../../utils/dom.js'
import { timeParse, timeFormat } from 'd3-time-format'
import chart from './chart'

const dateParse = timeParse('%Y%m%d')
const dateFormat = timeFormat('%b. %e')

const getStreak = (r, index, rows) => {
	// possibilities:
	// start, end, middle, alone
	const indexPrev = index - 1 
	const indexAfter = index + 1
	const prev = index === 0
		? ''
		: (r.won === rows[indexPrev].won ? 'streak-prev' : '')

	const next = index === rows.length - 1
		? ''
		: (r.won === rows[indexAfter].won ? 'streak-next' : '')

	const alone = !prev && !next ? 'streak-none' : ''

	const streak = `${prev} ${next} ${alone}`

	return {
		...r,
		streak
	}
}

const cleanRows = (rows) =>
	rows
		.map(r => ({
			...r,
			won: r.outcome.split(', ')[0],
			score: r.outcome.split(', ')[1],
			gamedate: dateFormat(dateParse(r.gamedate)),
			where: r.opp.indexOf('@') === 0 ? '@' : 'vs',
			opponentAbbr: r.opp.replace('@', ''),
		}))
		.sort((a, b) => a.gamedate < b.gamedate)
		.map(getStreak)

const updateData = (rows) => {
	const clean = cleanRows(rows)

	const team = rows[0].teamNickname

	const games = clean
		.map(r => `
			<tr class='${r.streak}'>
				<td>${r.won}</td>
				<td>${r.score}</td>
				<td>${r.where}</td>
				<td>${r.opponentAbbr}</td>
				<td>${r.gamedate}</td>
			</tr>
			`
		)

	const table = `
		<table class='previous-ten' summary='A table that has win/loss, score, opponent team, and game date across the top and the previous ${rows.length} games for ${team}.'>
			<thead class='display-none'>
				<tr>
					<th scope='col'>Win/loss</th>
					<th scope='col'>Score</th>
					<th scope='col'>Home/Away</th>
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

export default { updateData }