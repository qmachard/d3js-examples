// Random Dataset
var dataset = [];
var numDataPoints = 5 + Math.random() * 10;
var yRange = Math.random() * 1000;
for (var i = 0; i < numDataPoints; i++) {
    var newNumber1 = Math.round(Math.random() * yRange);
    dataset.push(newNumber1);
}

var h = 400,
    w = 600,
    r = 5,
    padding = 20;

var svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 '+w+' '+h)
    .attr('preserveAspectRatio', 'xMinYMin')
;

var scaleY = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([h - padding, padding])
;

var scaleX = d3.scaleLinear()
    .domain([0, dataset.length - 1])
    .range([padding, w - padding])
;

// Create line generator with D3
var line = d3.line()
    .curve(d3.curveCardinal)
    .x(function(d, i) {
        console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + scaleX(i) + ' using our xScale.');
        return scaleX(i);
    })
    .y(function(d, i) {
        console.log('Plotting Y value for data point: ' + d + ' to be at: ' + scaleY(d) + " using our yScale.");
        return scaleY(d);
    })
;

// Create line path using line generator
var path = svg
    .append("svg:path")
    .attr("d", line(dataset))
    .attr('fill', 'transparent')
    .attr('stroke', 'teal')
    .attr('stroke-width', 2)
;

// Animate line
var totalLength = path.node().getTotalLength();

path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(1500)
    .ease(d3.easeSinInOut)
    .attr("stroke-dashoffset", 0)
;
