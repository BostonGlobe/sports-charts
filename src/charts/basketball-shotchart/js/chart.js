	// var courtWidth = 50
	// var courtHeight = 47
 //  	var dimension = 320
 //    var margin = { top: 0, right: 0, bottom: 0, left: 0 }
	// var width = dimension - margin.left - margin.right
	// var height = dimension * (courtHeight / courtWidth) - margin.top - margin.bottom

 //    var shotX = d3.scale.linear()
 //    	.domain([-25, 25])
 //    	.range([0, width])

	// var shotY = d3.scale.linear()
	// 	.domain([-5.25, 41.75])
	// 	.range([height, 0])

	// var points = window.data.map(function(obj) {
	// 	var d = {
	// 		x: shotX(parseFloat(obj['shot-x'])),
	// 		y: shotY(parseFloat(obj['shot-y'])),
	// 		shotX: +obj['shot-x'],
	// 		shotY: +obj['shot-y'],
 //      		made: obj['event'].toLowerCase().indexOf('missed') < 0,
	// 	}
	// 	return d
	// })

	// var ratio = (1 / 21)
	// var hexRadius = Math.floor(width * ratio)
 //    var hexbin = d3.hexbin()
 //      .size([width, height])
 //      .radius(hexRadius)

 //    // the result of the hexbin layout
 //    var hexbinData = hexbin(points.map(function(obj) {
 //    	return [obj.x, obj.y, {made: obj.made, shotX: obj.shotX, shotY: obj.shotY}]
 //    }))

 //    // var tot = hexbinData.reduce(function(previous, current) {
 //    // 	if (current[0][2].shotX < 5 && current[0][2].shotX > -5 && current[0][2].shotY < 5) {
 //    // 		return previous += 1
 //    // 	} 
 //    // 	return previous
    	
 //    // }, 0)

 //    // console.log(hexbinData)

	// var maxRadius = d3.max(hexbinData, function(d) {
	// 	return d.length;
	// })

 //    var color = d3.scale.linear()
 //      .domain([0.15, .7])
 //      .range(['white', 'green'])
 //      .interpolate(d3.interpolateLab);
    
 //    // what is identity
 //    var x = d3.scale.identity()
 //      .domain([0, width]);

 //    var y = d3.scale.linear()
 //      .domain([0, height])
 //      .range([height, 0]);

 //    var radiusScale = d3.scale.linear()
 //    	.domain([1, maxRadius])
 //    	.range([1, hexRadius])

 //    var svg = d3.select('body').append('svg')
 //      .attr('width', width + margin.left + margin.right)
 //      .attr('height', height + margin.top + margin.bottom)
 //      .append('g')
 //      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// // what is clipath?
 //    svg.append('clipPath')
 //      .attr('id', 'clip')
 //      .append('rect')
 //      .attr({
 //      	'class': 'mesh',
 //      	'width': width,
 //      	'height': height,
 //      })

 //    // what does hexbin.hexagon do? (looks like it returns a path what params?)
 //    svg.append('g')
 //      .attr('clip-path', 'url(#clip)')
 //      .selectAll('.hexagon')
 //      .data(hexbinData)
 //      .enter().append('path')
 //      .attr('class', 'hexagon')
 //      .attr('d', function(d) { return hexbin.hexagon() })
 //      .attr('transform', function(d) {
 //        return 'translate(' + d.x + ',' + d.y + ')';
 //      })
 //      .style('fill', function(d) {
	// 	var made = d.reduce(function(previous, current) {
	// 		return previous += current[2].made ? 1 : 0
	// 	}, 0)
	// 	var percent = made / d.length
	// 	console.log(percent)
	// 	return color(percent)
 //      })
 //      .style('stroke', 'none');