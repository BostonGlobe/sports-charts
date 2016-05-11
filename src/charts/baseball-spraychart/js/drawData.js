import { select } from 'd3-selection'

// eslint-disable-next-line no-unused-vars
import { transition } from 'd3-transition'
import { timeFormat } from 'd3-time-format'

import colors from './../../../utils/colors.js'
import setSlider from './../../../utils/slider/setSlider.js'
import setSliderTooltip from './../../../utils/slider/setSliderTooltip.js'

colors['redsox-strongest'] = '#a2002e'
colors['redsox-secondary'] = '#ff2828'
colors['gray-tertiary'] = '#7f7f7f'

// create date formatting function
const dateFormat = timeFormat('%b. %e')

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
			Single: colors['redsox-secondary'],
			Double: colors['redsox-secondary'],
			Triple: colors['redsox-secondary'],
			'Home run': colors['redsox-strongest'],
		}[d.event] || colors['gray-tertiary']))
		.attr('fillStyle', d => ({
			Out: colors['gray-tertiary'],
			Single: colors.graypale,
			Double: colors['redsox-secondary'],
			Triple: colors['redsox-secondary'],
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
				const text = dateFormat(d.gameDateTime)

				setSlider({ container: sliderContainer, value: index + 1 })
				setSliderTooltip({ container: sliderContainer, text, index })

			}

		})

}

export default drawData
