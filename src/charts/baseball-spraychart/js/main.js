import { point } from 'd3-scale/src/band.js'

import setupIframe from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'
import createCanvas from './createCanvas.js'
import createPark from './createPark.js'

const container = $('.chart-container')
const π = Math.PI

// create canvas element
const canvas = createCanvas({ container })

// each zone is represented by one of the 26 letters
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// create scales

// 22 zones: π/2, or 90 deg
// 2 zones: π/22
// finally we rotate everything by π/4 counterclockwise
const zoneToAngle = point()
	.domain(letters)
	.range([π/4 - π/22, π/4 + 2*π/4 + π/22])

// create grid
createPark({ canvas })

// fetch data and draw chart


















// this gets fired when we receive data
function handleDataLoaded(data) {

	$('.chart-container .count span').innerHTML = data.length
	$('.chart-container pre').innerHTML = JSON.stringify(data, null, 2)

}

// this gets fired when there is an error fetching data
function handleDataError(error) {
	console.error(error)
}

// this starts the pym resizer and takes a callback.
// the callback will fire when we receive data
setupIframe(handleDataLoaded, handleDataError)

