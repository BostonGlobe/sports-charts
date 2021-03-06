import { select } from 'd3-selection'
import dateline from 'dateline'

// eslint-disable-next-line no-unused-vars
import { transition } from 'd3-transition'

import colors from './../../../utils/colors.js'
import setSlider from './../../../utils/slider/setSlider.js'
import setSliderTooltip from './../../../utils/slider/setSliderTooltip.js'

const drawData = ({ data, detachedContainer, scales, gameDateTime,
uniqueDates, sliderContainer, isChartbuilder }) => {

	if (!scales) return

	// if we have a gameDateTime, then only show data up to that gameDateTime
	const filteredData = gameDateTime ?
		data.filter(x => x.gameDateTime <= gameDateTime) :
		data

	const DELAY = 0
	const DURATION = isChartbuilder ? 0 : gameDateTime ? 300 : 500

	const { x, y, origin } = scales

	// get the custom data container
	const dataContainer = select(detachedContainer)

	// JOIN
	const circles = dataContainer.selectAll('custom.circle')
		.data(filteredData, d => d.id)

	// EXIT
	circles.exit()
		.transition()
		.delay(0)
		.duration(DURATION / 5)
		.attr('cx', origin.x)
		.attr('cy', origin.y)
		.attr('opacity', 0)
		.remove()

	// ENTER
	circles.enter().append('custom')
		.attr('class', 'circle')
		.attr('strokeStyle', d => ({
			Out: colors['gray-tertiary'],
			Single: colors['redsox-secondary-as-fill'],
			Double: colors['redsox-secondary-as-fill'],
			Triple: colors['redsox-secondary-as-fill'],
			'Home run': colors['redsox-primary'],
		}[d.event] || colors['gray-tertiary']))
		.attr('fillStyle', d => ({
			Out: colors['gray-tertiary'],
			Single: 'none',
			Sacrifice: 'none',
			'Sacrifice fly': 'none',
			Double: colors['redsox-secondary-as-fill'],
			Triple: colors['redsox-secondary-as-fill'],
			'Home run': colors['redsox-primary'],
		}[d.event] || 'white'))
		.attr('isHalf', d => d.event === 'Double')
		.attr('r', d => d.event === 'Home run' ? 9 : 6)
		.attr('cx', origin.x)
		.attr('cy', origin.y)
		.attr('opacity', 0)
		.transition()
		.delay((d, i) => i * DELAY)
		.duration(DURATION)
		.attr('cx', x)
		.attr('cy', y)
		.attr('opacity', 1)
		.on('start', (d) => {

			// if we don't have a gameDateTime (which means this is called at the
			// beginning), then we should, at the start of every transition,
			// set the slider to this datum's time
			if (!gameDateTime) {

				const time = d.gameDateTime.getTime()
				const index = uniqueDates.indexOf(time)
				const text = dateline(d.gameDateTime).getAPDate()

				setSlider({ container: sliderContainer, value: index + 1 })
				setSliderTooltip({ container: sliderContainer, text, index })

			}

		})

}

export default drawData
