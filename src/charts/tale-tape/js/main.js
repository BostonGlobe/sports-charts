import { setupIframe } from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'
import formatValue from './../../../utils/formatValue.js'

// convenience variables
const container = $('.chart-container')

const handleNewData = ({ rows, groupBy }) => {

	// first get the compareBy fields
	const { _type, id, [groupBy]: value, ...other } = rows[0]

	const data = Object.keys(other)
		.map(d => ({
			key: d,
			values: rows.map(r => ({
				key: r[groupBy],
				value: r[d],
			})),
		}))
		.map(d => ({
			...d,
			max: d.values.map(v => v.value).sort().slice(-1)[0],
		}))
		.map(d => ({
			...d,
			values: d.values.map(v => ({
				...v,
				width: Math.round(100 * v.value / d.max),
				display: formatValue({
					key: d.key,
					value: v.value,
					_type: rows[0]._type,
				})
			})),
		}))

	container.innerHTML = data.map(({ key, values }) =>
		`<li class='measure'>
			<p class='name'><span>${key}</span></p>
			<ul class='values'>
				${values.map(p =>
					`<li style='width: ${p.width}%'><span>${p.display}</span></li>`
				).join('')}
			</ul>
		</li>`).join('')

}

const handleNewPayload = (payload) => {
	if (payload.rows) handleNewData(payload)
}

setupIframe(handleNewPayload)
