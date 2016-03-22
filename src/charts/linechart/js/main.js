import setupIframe from '../../../utils/setup-iframe'

import { $ } from '../../../utils/dom.js'

import createSvg from './createSvg.js'
import createScales from './createScales.js'
import drawData from './drawData.js'

// convenience variables
const container = $('.chart-container')

// get the chart container outside width
let { offsetWidth } = container
offsetWidth = offsetWidth

// setup chart margins
const margins = { top: 15, right: 15, bottom: 15, left: 15 }
const width = offsetWidth - margins.left - margins.right
const height = width / 2.35

// create the svg element
const g = createSvg({ container, margins, width, height })

const handleNewPayload = (err, payload) => {

	if (err) {
		// TODO: better error handling
		console.log("Oops. Look like we couldn't load this chart's data.")
		return
	}

	const { data } = payload

	const dimensions = {
		x: 'gameno',
		y: 'run-differential',
		group: null
	}

	const scales = createScales({ width, height, data, dimensions })

	drawData({ data, g, scales, dimensions })

}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleNewPayload)
