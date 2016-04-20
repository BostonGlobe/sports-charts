import { setupIframe } from '../../../utils/setup-iframe'
import { $, addClass } from '../../../utils/dom.js'

// convenience variables
const container = $('.chart-container')

const handleNewData = ({ rows, groupBy, isChartbuilder }) => {

	// first get the compareBy fields
	const { _type, id, [groupBy]: value, ...other } = rows[0]

	const data = Object.keys(other)
		.map(d => ({
			key: d,
			values: rows.map(r => ({
				key: r[groupBy],
				value: r[d],
			}))
		}))
		.map(d => ({
			...d,
			max: d.values.map(v => v.value).sort().slice(-1)[0],
		}))
		.map(d => ({
			...d,
			values: d.values.map(v => ({
				...v,
				width: Math.round(100*v.value/d.max),
			})),
		}))

	container.innerHTML = data.map(({ key, values }) =>
		`<li class='measure'>
			<p class='name'><span>${key}</span></p>
			<ul class='values'>
				${values.map(p =>
					`<li style='width: ${p.width}%'>
					<span class='${p.width < 50 ? 'outside' : 'inside'}'>${p.value}</span></li>`
				).join('')}
			</ul>
		</li>`).join('')

	// // populate hed
	// $('.chart-top--hed').innerHTML = rows
	// 	.map(r => `<span class='player'>${r[groupBy]}</span>`)
	// 	.join('<span> vs </span>')

	// $('.chart-top--subhed').innerHTML = '2015 season'

}

const handleNewPayload = (payload) => {
	if (payload.rows) handleNewData(payload)
}

setupIframe(handleNewPayload)
