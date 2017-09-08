var dataset = [];
var numDataPoints = 300;
var xRange = Math.random() * 1000;
var yRange = Math.random() * 1000;
for (var i = 0; i < numDataPoints; i++) {
    var newNumber1 = Math.round(Math.random() * xRange);
    var newNumber2 = Math.round(Math.random() * yRange);
    dataset.push([newNumber1, newNumber2]);
}

var w = 500,
    h = 200,
    r = 2,
    padding = 20
;

var svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
;

// Scales

var xScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
        return d[0];
    })])
    .range([padding, w - padding * 2])
;

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
        return d[1];
    })])
    .range([h - padding, padding])
;

// Plots

svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('r', r)
    .attr('cx', function(d) {
        return xScale(d[0]);
    })
    .attr('cy', function(d) {
        return yScale(d[1]);
    })
;

// Axis

var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5)
;

svg.append('g')
    .call(xAxis)
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + (h - padding) + ')')
;

var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5)
;

svg.append('g')
    .call(yAxis)
    .attr('class', 'axis')
    .attr('transform', 'translate(' + padding + ', 0)')
;
