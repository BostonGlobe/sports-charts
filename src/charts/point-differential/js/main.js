import setupIframe from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'
import sortData from './sortData.js'
import createSvg from './createSvg.js'
import drawData from './drawData.js'
import createScales from './createScales.js'

// convenience variables
const container = $('.chart-container')

// get the chart container outside width
let { offsetWidth } = container

// setup chart margins
const margins = { top: 10, right: 0, bottom: 40, left: 25 }
const width = offsetWidth - margins.left - margins.right
const height = width * 3/4

// create the svg element
const svg = createSvg({ container, margins, width, height })

const handleNewPayload = ({ rows, isChartbuilder }) => {

	// sort data
	const data = sortData(rows)

	// create scales
	const scales = createScales({ width, height, data })

	// draw data
	drawData({ svg, data, scales })

}

setupIframe(handleNewPayload)
