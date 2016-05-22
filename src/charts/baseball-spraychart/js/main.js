import { timer } from 'd3-timer'
import dateline from 'dateline'

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
let handleInput = (e) => e
const onInput = (e) => handleInput(e)
let tracked = false
let svg
let canvas
let scales
let data
let uniqueDates
let sliderInput
let isChartbuilder
let globalWidth = 300
let readyToResize = false

// create a custom container that will not be drawn to DOM,
// but will be used to hold the data elements
let detachedContainer = document.createElement('custom')

// create slider
sliderInput = createSlider({ container: sliderContainer, onInput })

// setup chart margins
const margins = { top: 10, right: 10, bottom: 10, left: 10 }

// for now we will say our ballpark max distance is 443
const parkSize = 460

const drawGrid = () => {

	// if it exists, remove svg first
	svg && svg.remove()

	// get the chart dimensions
	const width = (globalWidth * 2) - margins.left - margins.right
	const height = Math.sqrt(Math.pow(globalWidth * 2, 2) / 2) -
		margins.top - margins.bottom

	// create scales
	scales = createScales({ parkSize, height })

	// create the svg element
	// this will hold the ballpark, infield, diamond, grid, etc
	svg = createSvg({ container: svgContainer, margins, width, height,
		parkSize })

	return { width, height }

}

// listen for resize event
const handleResize = () => {

	if (readyToResize) {

		const { width, height } = drawGrid()

		// reset canvas element
		canvas = resetCanvas({ container: canvasContainer, margins, width,
			height })

		detachedContainer = document.createElement('custom')

		// get the slider position
		const { value } = sliderInput
		const gameDateTime = uniqueDates[value - 1]

		// only draw data based on slider position if the timer has stopped
		if (initialTimer && !initialTimer._call) {

			// draw data based on slider position
			drawData({ data, detachedContainer, scales, gameDateTime,
				uniqueDates, sliderContainer, isChartbuilder })

			// draw canvas based on the data we just drew above
			drawCanvas({ canvas, detachedContainer })

		}

	}

}

// start a timer that will run every tick,
// and redraw the canvas
timer(() => drawCanvas({ canvas, detachedContainer }))

// this timer manages the initial animation
let initialTimer

// handle input change (draw data, set tooltip)
const handleInputChange = (e) => {

	if (!tracked) {
		tracked = true
		track('Click')
	}

	// stop the timer, if it's running
	// why do we need this? well, if the user updates the slider
	// during initial animation, we need to stop the animation
	// and immediately draw up to the user's desired data
	initialTimer.stop()

	// get the slider position
	const { value } = e.target
	const gameDateTime = new Date(uniqueDates[value - 1])

	const text = dateline(gameDateTime).getAPDate()

	setSliderTooltip({ container: sliderContainer, text, index: value - 1 })

	// draw data based on slider input
	drawData({ data, detachedContainer, scales, gameDateTime, uniqueDates,
		isChartbuilder })

}

const setNewData = (newData) => {

	// sort data by gameDateTime
	data = sortData(newData)

	// get array of unique dates
	uniqueDates = getUniqueDates(data)

}

const drawChart = (newData) => {

	readyToResize = true

	// if this is chartbuilder, don't animate
	if (isChartbuilder) {

		handleResize()

		// draw data
		drawData({ data, detachedContainer, isChartbuilder,
			scales, uniqueDates, sliderContainer })

	} else {

		handleResize()

		// show slider
		removeClass(sliderContainer, 'display-none')

		// create the slider start/end labels
		const labels = {
			start: data.length ? dateline(data[0].gameDateTime).getAPDate() : '',
			end: data.length ?
				dateline(data[data.length - 1].gameDateTime).getAPDate() : '',
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
					scales, uniqueDates, sliderContainer, isChartbuilder })

			} else {

				// no, we're at the end - stop.
				initialTimer.stop()
			}

		})

	}

}

const handleNewPayload = (payload) => {
	const { rows } = payload
	if (rows) {
		setNewData(rows)
		drawGrid(rows)
	}
}

const handleEnterView = (payload) => {
	const { rows } = payload
	isChartbuilder = payload.isChartbuilder
	if (rows) {
		setNewData(rows)
		drawChart(rows)
	}
}

const resizeEvent = (width) => {
	globalWidth = width
	handleResize()
}

setupIframe({ handleNewPayload, handleEnterView, resizeEvent })
