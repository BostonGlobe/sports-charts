import { setupIframe } from '../../../utils/setup-iframe'
import { $, addClass } from '../../../utils/dom.js'

// convenience variables
const container = $('.chart-container')

const handleNewData = ({ rows, groupBy, isChartbuilder }) => {

	// first get the compareBy fields
	const { _type, id, [groupBy]: value, ...other } = rows[0]

	const compareBy = Object.keys(other)

	const result = [
		{
			key: 'balls',
			values: [
				{
					key: 'David Ortiz',
					value: 0.4,
					width: 40,
				},
				{
					key: 'Dustin Pedroia',
					value: 1,
					width: 100,
				},
			],
		},
		{
			key: 'outs',
			values: [
				{
					key: 'David Ortiz',
					value: 3,
					width: 100,
				},
				{
					key: 'Dustin Pedroia',
					value: 1,
					width: 33,
				},
			],
		}
	]

	container.innerHTML = result.map(({ key, values }) =>
		`<li class='measure'>
			<p class='name'><span>${key}</span></p>
			<ul class='values'>
				${values.map(p =>
					`<li style='width: ${p.width}%'>
					<span class='${p.width < 50 ? 'outside' : 'inside'}'>${p.value}</span></li>`
				).join('')}
			</ul>
		</li>`).join('')

	// const { data, sport } = payload

	// addClass(container, sport)
	// addClass($('header'), sport)

	// // populate hed
	// $('header h1.players').innerHTML = data[0].values.map(p =>
	// 	`<a href='http://www.google.com' target='_blank'>${p.player}</a>`
	// ).join(' vs ')

}

const handleNewPayload = (payload) => {
	if (payload.rows) handleNewData(payload)
}

setupIframe(handleNewPayload)
