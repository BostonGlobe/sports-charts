import { timer } from 'd3-timer'
import { timeFormat } from 'd3-time-format'

import { setupIframe, track } from '../../../utils/setup-iframe'
import { $, removeClass } from '../../../utils/dom.js'
import createScales from './createScales.js'
import createSvg from './createSvg.js'
import resetCanvas from './resetCanvas.js'
import drawData from './drawData.js'
import drawCanvas from './drawCanvas.js'
import sortData from './sortData.js'
import getUniqueDates from './getUniqueDates.js'
import createSlider from './../../../utils/slider/createSlider.js'
import setupSlider from './../../../utils/slider/setupSlider.js'
import setSliderTooltip from './../../../utils/slider/setSliderTooltip.js'

// convenience variables
const chartContainer = $('.chart-container')
const svgContainer = chartContainer.querySelector('.svg-container')
const canvasContainer = chartContainer.querySelector('.canvas-container')
const sliderContainer = $('.slider-container')
const dateFormat = timeFormat('%b. %e')
let handleInput = (e) => e
const onInput = (e) => handleInput(e)
let tracked = false
let svg
let canvas
let scales
let data
let uniqueDates
let sliderInput

// create a custom container that will not be drawn to DOM,
// but will be used to hold the data elements
let detachedContainer = document.createElement('custom')

// create slider
sliderInput = createSlider({ container: sliderContainer, onInput })

// setup chart margins
const margins = { top: 10, right: 10, bottom: 10, left: 10 }

// for now we will say our ballpark max distance is 443
const parkSize = 443

// listen for resize event
const handleResize = () => {

	// if it exists, remove svg first
	svg && svg.remove()

	// get the chart container outside width
	let { offsetWidth } = chartContainer
	offsetWidth = offsetWidth * 2

	// get the chart dimensions
	const width = offsetWidth - margins.left - margins.right
	const height = Math.sqrt(Math.pow(offsetWidth, 2) / 2) -
		margins.top - margins.bottom

	// create scales
	scales = createScales({ parkSize, height })

	// create the svg element
	// this will hold the ballpark, infield, diamond, grid, etc
	svg = createSvg({ container: svgContainer, margins, width, height,
		parkSize })

	// reset canvas element
	canvas = resetCanvas({ container: canvasContainer, margins, width,
		height })

	// get the slider position
	const { value } = sliderInput
	const gameDateTime = uniqueDates[value - 1]

	detachedContainer = document.createElement('custom')

	// draw data based on slider position
	drawData({ data, detachedContainer, scales, gameDateTime, uniqueDates })

	// draw canvas based on the data we just drew above
	drawCanvas({ canvas, detachedContainer })

}

// start a timer that will run every tick,
// and redraw the canvas
timer(() => drawCanvas({ canvas, detachedContainer }))

// this timer manages the initial animation
let initialTimer

// handle input change (draw data, set tooltip)
const handleInputChange = (e) => {

	if (!tracked) {
		track('Click')
		tracked = true
	}

	// stop the timer, if it's running
	// why do we need this? well, if the user updates the slider
	// during initial animation, we need to stop the animation
	// and immediately draw up to the user's desired data
	initialTimer.stop()

	// get the slider position
	const { value } = e.target
	const gameDateTime = uniqueDates[value - 1]

	const text = dateFormat(new Date(gameDateTime))

	setSliderTooltip({ container: sliderContainer, text, index: value - 1 })

	// draw data based on slider input
	drawData({ data, detachedContainer, scales, gameDateTime, uniqueDates })

}

const handleNewData = (newData, isChartbuilder) => {

	// sort data by gameDateTime
	data = sortData(newData)

	// get array of unique dates
	uniqueDates = getUniqueDates(data)

	setupResize = () => window.addEventListener('resize', handleResize)
	setupResize()

	// if this is chartbuilder, don't animate
	if (isChartbuilder) {

		// draw data
		drawData({ data, detachedContainer,
			scales, uniqueDates, sliderContainer })

	} else {

		// show slider
		removeClass(sliderContainer, 'display-none')

		// create the slider start/end labels
		const labels = {
			start: data.length ? dateFormat(data[0].gameDateTime) : '',
			end: data.length ? dateFormat(data[data.length - 1].gameDateTime) : '',
		}

		// setup slider (set input max, set start/end labels)
		setupSlider({ container: sliderContainer, labels,
			max: uniqueDates.length })

		// on input change, call a function with data-specific variables
		handleInput = (e) => handleInputChange(e)

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
	const { rows, isChartbuilder } = payload
	if (rows) handleNewData(rows, isChartbuilder)
}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleNewPayload)
