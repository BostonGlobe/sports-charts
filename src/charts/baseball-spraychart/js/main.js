import { timer } from 'd3-timer'
import { timeFormat } from 'd3-time-format'

import setupIframe from '../../../utils/setup-iframe'
import { $, removeClass } from '../../../utils/dom.js'
import createScales from './createScales.js'
import createSvg from './createSvg.js'
import createCanvas from './createCanvas.js'
import drawData from './drawData.js'
import drawCanvas from './drawCanvas.js'
import formatData from './formatData.js'
import getUniqueDates from './getUniqueDates.js'
import createSlider from './../../../utils/slider/createSlider.js'
import setupSlider from './../../../utils/slider/setupSlider.js'
import setSliderTooltip from './../../../utils/slider/setSliderTooltip.js'

// convenience variables
const chartContainer = $('.chart-container')
const sliderContainer = $('.slider-container')
const dateFormat = timeFormat('%b. %e')
let handleInput = (e) => e
const onInput = (e) => handleInput(e)

// create slider
createSlider({ container: sliderContainer, onInput })

// get the chart container outside width
let { offsetWidth } = chartContainer
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
createSvg({ container: chartContainer, margins, width, height, parkSize })

// create canvas element
const canvas = createCanvas({ container: chartContainer, margins, width,
	height })

// create a custom container that will not be drawn to DOM,
// but will be used to hold the data elements
const detachedContainer = document.createElement('custom')

// start a timer that will run every tick,
// and redraw the canvas
timer(() => drawCanvas({ canvas, detachedContainer }))

// this timer manages the initial animation
let initialTimer

// handle input change (draw data, set tooltip)
const handleInputChange = ({ e, uniqueDates, data }) => {

	// stop the timer, if it's running
	// why do we need this? well, if the user updates the slider
	// during initial animation, we need to stop the animation
	// and immediately draw up to the user's desired data
	initialTimer.stop()

	// get the slider position
	const { value } = e.target
	const gamedate = uniqueDates[value - 1]

	const text = dateFormat(new Date(gamedate))

	// setSlider({ container: sliderContainer, value })
	setSliderTooltip({ container: sliderContainer, text, index: value - 1 })

	// draw data based on slider input
	drawData({ data, detachedContainer, scales, gamedate, uniqueDates })

}

const handleNewData = (newData, isChartbuilder) => {

	// format the data (i.e. turn gamedate into Date, etc)
	const data = formatData(newData)

	// get array of unique dates
	const uniqueDates = getUniqueDates(data)

	// if this is chartbuilder, don't animate
	if (isChartbuilder) {

		// draw data
		drawData({ data, detachedContainer,
			scales, uniqueDates, sliderContainer })

	} else {

		// show slider
		removeClass(sliderContainer, 'displayNone')

		// create the slider start/end labels
		const labels = {
			start: data.length ? dateFormat(data[0].gamedate) : '',
			end: data.length ? dateFormat(data[data.length - 1].gamedate) : '',
		}

		// setup slider (set input max, set start/end labels)
		setupSlider({ container: sliderContainer, labels,
			max: uniqueDates.length })

		// on input change, call a function with data-specific variables
		handleInput = (e) => handleInputChange({ e, uniqueDates, data })

		// we'll use this to manage data during initial animation
		let dataIndex = 0

		// start the initial animation
		initialTimer = timer(() => {

			// are we before the end?
			if (dataIndex < data.length) {

				// draw data
				// in other words, draw an array of one more datum
				drawData({ data: data.slice(0, ++dataIndex), detachedContainer,
					scales, uniqueDates, sliderContainer })

			} else {

				// no, we're at the end - stop.
				initialTimer.stop()
			}

		})

	}

}

const handleNewPayload = (payload) => {

	const { hed, rows, isChartbuilder } = payload

	if (hed) document.querySelector('header h1').textContent = hed
	if (rows) handleNewData(rows, isChartbuilder)

}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleNewPayload)
