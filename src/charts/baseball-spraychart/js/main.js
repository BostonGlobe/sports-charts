import { scalePoint } from 'd3-scale'

import setupIframe from '../../../utils/setup-iframe'
import { $ } from '../../../utils/dom.js'
import createSvg from './createSvgBackground.js'

const π = Math.PI
const container = $('.chart-container')
const { offsetWidth } = container

// setup chart margins
const margins = { top: 10, right: 10, bottom: 10, left: 10 }
const width = offsetWidth - margins.left - margins.right
const height = Math.sqrt(Math.pow(offsetWidth, 2)/2) -
	margins.top - margins.bottom

// for now we will say our ballpark max distance is 500
const parkSize = 443

// start creating scales. first: zones to angles.
// each zone is represented by one of the 26 letters
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// 22 zones: π/2, or 90 deg
// 2 zones: π/22
// finally we rotate everything by π/4 counterclockwise
const zoneToAngle = scalePoint()
	.domain(letters)
	.range([π/4 - π/22, π/4 + 2*π/4 + π/22])

createSvg({ container, margins, width, height, parkSize })

// // create canvas element
// const canvas = createCanvas({ container })


// import createCanvas from './createCanvas.js'
// import createPark from './createPark.js'

// // // create scales

// // // create grid
// // createPark({ canvas })

// // // fetch data and draw chart


















// this gets fired when we receive data
function handleDataLoaded(data) {

	// $('.chart-container .count span').innerHTML = data.length
	// $('.chart-container pre').innerHTML = JSON.stringify(data, null, 2)

}

// this gets fired when there is an error fetching data
function handleDataError(error) {
	console.error(error)
}

// // // this starts the pym resizer and takes a callback.
// // // the callback will fire when we receive data
setupIframe({ handleDataLoaded, handleDataError })
