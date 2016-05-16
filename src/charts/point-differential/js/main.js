import { setupIframe } from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'
import sortData from './sortData.js'
import createSvg from './createSvg.js'
import drawData from './drawData.js'
import createScales from './createScales.js'

// convenience variables
const container = $('.chart-container')

// setup chart margins
const margins = { top: 10, right: 0, bottom: 40, left: 25 }
let svg
let g
let scales
let data = []
let globalWidth = 300

const handleResize = () => {

	const width = globalWidth - margins.left - margins.right
	const height = width * 3 / 4

	// if it exists, remove svg first
	svg && svg.remove()

	// create the svg element
	const parts = createSvg({ container, margins, width, height })
	svg = parts.svg
	g = parts.g

	// create scales
	scales = createScales({ width, height, data })

	// draw data
	drawData({ svg: g, data, scales })

}

const handleEnterView = () => {
}

const handleNewPayload = ({ rows }) => {

	// sort data
	data = sortData(rows)

	handleResize()

}

const resizeEvent = (width) => {

	globalWidth = width
	handleResize()

}

setupIframe({ handleNewPayload, handleEnterView, resizeEvent })
