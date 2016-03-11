(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('d3-scale'), require('get-json-lite'), require('pym-iframe-resizer'), require('d3-selection')) :
	typeof define === 'function' && define.amd ? define(['d3-scale', 'get-json-lite', 'pym-iframe-resizer', 'd3-selection'], factory) :
	(factory(global.d3Scale,global.getJSON,global.pymIframe,global.d3Selection));
}(this, function (d3Scale,getJSON,pymIframe,d3Selection) { 'use strict';

	getJSON = 'default' in getJSON ? getJSON['default'] : getJSON;
	pymIframe = 'default' in pymIframe ? pymIframe['default'] : pymIframe;

	var setup = function setup(handleDataLoaded, handleDataError) {

		var pymChild = pymIframe({});

		// talk to chartifier
		pymChild.onMessage('receive-data', function (d) {
			return handleDataLoaded(JSON.parse(d));
		});
		pymChild.sendMessage('request-data', true);

		// talk to production
		pymChild.onMessage('receive-data-url', function (url) {
			return getJSON(url, handleDataLoaded, handleDataError);
		});
		pymChild.sendMessage('request-data-url', true);
	};

	var $ = function $(selector) {
		return document.querySelector(selector);
	};

	function createCanvas(_ref) {
		var container = _ref.container;
		var offsetWidth = container.offsetWidth;

		// setup chart margins

		var top = 10,
		    right = 10,
		    bottom = 10,
		    left = 10;
		var width = offsetWidth - left - right;
		var height = Math.sqrt(Math.pow(offsetWidth, 2) / 2) - top - bottom;

		// create canvas element
		var canvas = d3Selection.select(container).append('canvas').attr('width', width + left + right).attr('height', height + top + bottom).attr('innerWidth', width).attr('innerHeight', height).node();

		// make room for margins
		canvas.getContext('2d').translate(left + width / 2, top);

		return canvas;
	}

	var π$1 = Math.PI;

	function createPark(_ref) {
		var canvas = _ref.canvas;
		var _ref$parkRadius = _ref.parkRadius;
		var parkRadius = _ref$parkRadius === undefined ? 500 : _ref$parkRadius;


		var width = canvas.getAttribute('innerWidth');
		var height = canvas.getAttribute('innerHeight');

		var parkScale = d3Scale.scaleLinear().domain([0, parkRadius]).range([0, height]);

		var c = canvas.getContext('2d');

		// draw park
		c.beginPath();
		c.moveTo(0, height);
		c.arc(0, height, height, -π$1 / 4, -3 * π$1 / 4, true);
		c.lineTo(0, height);
		c.lineWidth = 0.5;
		c.strokeStyle = 'black';
		c.stroke();
		c.fillStyle = 'red';
		c.fill();

		// draw inside lines
		var markers = [100, 200, 300, 400];
		markers.forEach(function (m) {
			c.beginPath();
			c.arc(0, height, parkScale(m), -π$1 / 4, -3 * π$1 / 4, true);
			c.lineWidth = 5;
			c.strokeStyle = 'black';
			c.stroke();
		});
	}

	var container = $('.chart-container');
	var π = Math.PI;

	// create canvas element
	var canvas = createCanvas({ container: container });

	// each zone is represented by one of the 26 letters
	var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	// create scales

	// 22 zones: π/2, or 90 deg
	// 2 zones: π/22
	// finally we rotate everything by π/4 counterclockwise
	var zoneToAngle = d3Scale.scalePoint().domain(letters).range([π / 4 - π / 22, π / 4 + 2 * π / 4 + π / 22]);

	// create grid
	createPark({ canvas: canvas });

	// fetch data and draw chart

	// this gets fired when we receive data
	function handleDataLoaded(data) {

		$('.chart-container .count span').innerHTML = data.length;
		$('.chart-container pre').innerHTML = JSON.stringify(data, null, 2);
	}

	// this gets fired when there is an error fetching data
	function handleDataError(error) {
		console.error(error);
	}

	// this starts the pym resizer and takes a callback.
	// the callback will fire when we receive data
	setup(handleDataLoaded, handleDataError);

}));