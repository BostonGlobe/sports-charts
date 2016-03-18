// import { timer } from 'd3-timer'

import setupIframe from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'
import formatData from './formatData.js'
import createSvg from './createSvg.js'
import createCanvas from './createCanvas.js'
import drawData from './drawData.js'
import createScales from './createScales.js'
import drawCanvas from './drawCanvas.js'

// convenience variables
const container = $('.chart-container')

// get the chart container outside width
let { offsetWidth } = container
offsetWidth = offsetWidth * 2

// setup chart margins
// const margins = { top: 10, right: 10, bottom: 10, left: 10 }
const margins = { top: 0, right: 0, bottom: 0, left: 0 }
const width = offsetWidth - margins.left - margins.right
// const height = Math.round(width * 9 / 16)
const height = width / 8

// create the svg element
createSvg({ container, margins, width, height })

// create canvas element
const canvas = createCanvas({ container, margins, width, height })

// create a custom container that will not be drawn to DOM,
// but will be used to hold the data elements
const detachedContainer = document.createElement('custom')

// start a timer that will run every tick,
// and redraw the canvas
// timer(() => drawCanvas({ canvas, detachedContainer }))

const handleNewData = (newData) => {

	// format the data (i.e. turn gamedate into Date, etc)
	const data = formatData(newData)

	const scales = createScales({ width, height, data })

	// draw data
	drawData({ data, detachedContainer, scales })

	drawCanvas({ canvas, detachedContainer })

}

setupIframe(handleNewData)
