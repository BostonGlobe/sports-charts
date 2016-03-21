import setupIframe from '../../../utils/setup-iframe'
import { $, addClass } from '../../../utils/dom.js'

const handleNewPayload = (err, payload) => {

	if (err) {
		// TODO: better error handling
		console.log("Oops. Look like we couldn't load this chart's data.")
		return
	}

	const { data, sport } = payload

	// convenience variables
	const container = $('.chart-container')

	addClass(container, sport)
	addClass($('header'), sport)

	// populate hed
	$('header h1.players').innerHTML = data[0].values.map(p =>
		`<a href='http://www.google.com' target='_blank'>${p.player}</a>`
	).join(' vs ')

	// populate bars
	container.innerHTML = data.map(d => {

		const values = d.values.map(p => p.value).sort((a, b) => a - b)
		const max = values[1]

		return `
		<li class='measure'>

			<p class='name'><span>${d.measure}</span></p>
			<ul class='values'>
				${d.values.map(p =>
					`<li style='width: ${Math.round(100*p.value/max)}%'>
						<span>${p.value}<span>
					</li>`
				).join('')}
			</ul>

		<li>
		`

	}).join('')

}

setupIframe(handleNewPayload)
