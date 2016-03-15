import { timer } from 'd3-timer'

import setupIframe from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'
import createScales from './createScales.js'
import createSvg from './createSvg.js'
import createCanvas from './createCanvas.js'
import drawData from './drawData.js'
import drawCanvas from './drawCanvas.js'
import setupSlider from './setupSlider.js'
import formatData from './formatData.js'
import getUniqueDates from './getUniqueDates.js'
import setSliderTooltip from './setSliderTooltip.js'
import setSlider from './setSlider.js'

// convenience variables
const container = $('.chart-container')
const input = $('.slider input')
const start = $('.slider-date-ranges .start-date span')
const end = $('.slider-date-ranges .end-date span')
const tooltip = $('.slider-current-date')
const labels = { start, end }
let { offsetWidth } = container
offsetWidth = offsetWidth * 2

// setup chart margins
const margins = { top: 10, right: 10, bottom: 10, left: 10 }
const width = offsetWidth - margins.left - margins.right
const height = Math.sqrt(Math.pow(offsetWidth, 2) / 2) -
	margins.top - margins.bottom

// for now we will say our ballpark max distance is 443
const parkSize = 443

// create all our scales
const scales = createScales({ parkSize, height })

// create the svg element
// this will hold the ballpark, infield, diamond, grid, etc
createSvg({ container, margins, width, height, parkSize })

// create canvas element
const canvas = createCanvas({ container, margins, width, height })

// create a custom container that will not be drawn to DOM,
// but will be used to hold the data elements
const detachedContainer = document.createElement('custom')

// start a timer that will run every tick,
// and redraw the canvas
timer(() => drawCanvas({ canvas, detachedContainer }))

let initialTimer

const handleInputChange = ({ e, uniqueDates, data }) => {

	initialTimer.stop()

	const { value } = e.target
	const gamedate = uniqueDates[value - 1]

	setSlider({ input, value })

	setSliderTooltip({ input, time: gamedate, index: value - 1, tooltip })

	drawData({ data, detachedContainer, scales, gamedate, uniqueDates,
		input, tooltip })

}

// this gets fired when we receive data
const handleDataLoaded = (err, rawdata) => {

	if (err) {
		// TODO: better error handling
		console.log("Oops. Look like we couldn't load this chart's data.")
		return
	}

	const data = formatData(rawdata)
	const uniqueDates = getUniqueDates(data)

	setupSlider({ data, uniqueDates, input, tooltip, labels,
		onInputChange: (e) => handleInputChange({ e, uniqueDates, data }) })

	let dataIndex = 0
	initialTimer = timer(() => {

		// are we at the end? if so stop.
		if (dataIndex < data.length) {

			drawData({ data: data.slice(0, dataIndex++), detachedContainer,
				scales, uniqueDates, input, tooltip })

		} else {
			initialTimer.stop()
		}
		// otherwise continue

	})

	// start a loop that will call drawData once every second, with new data

}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe({ handleDataLoaded })
