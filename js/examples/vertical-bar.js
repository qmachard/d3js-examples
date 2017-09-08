// Random Dataset
var dataset = [];
var numDataPoints = 5 + Math.random() * 10;
var yRange = Math.random() * 1000;
for (var i = 0; i < numDataPoints; i++) {
    var newNumber1 = Math.round(Math.random() * yRange);
    dataset.push(newNumber1);
}

var h = 400;
var barMargin = 0.1;
var barWidth = 100 / dataset.length - barMargin * dataset.length;

var svg = d3.select('#chart').append('svg')
    .attr('height', h)
    .attr('width', '100%')
;

// Scale
var scale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, h])
;

// Plot
var plots = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function (d, i) {
        return (i * (100 / dataset.length + barMargin)) + '%';
    })
    .attr('y', h)
    .attr('width', barWidth + '%')
    .attr('height', 0)
    .attr('fill', 'teal')
;

// Plot animation
plots.transition()
    .duration(500)
    .delay(function (d, i) {
        return i * 50;
    })
    .attr('height', function (d) {
        return scale(d);
    })
    .attr('y', function (d) {
        return h - scale(d);
    })
;

// Label
var labels = svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function (d) {
        return d;
    })
    .attr('x', function (d, i) {
        return (i * (100 / dataset.length + barMargin)) + (barWidth / 2) + '%';
    })
    .attr('y', function (d) {
        var scaledY = scale(d);

        if (scaledY < 20) {
            return h - scaledY - 10;
        }

        return h - scaledY + 20;
    })
    .attr('width', barWidth)
    .attr('fill', function (d) {
        return scale(d) < 20 ? '#797979' : 'white';
    })
    .attr('text-align', 'center')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '14px')
    .attr("text-anchor", "middle")
    .attr('opacity', 0)
;

// Label animation
labels.transition()
    .duration(500)
    .delay(function (d, i) {
        return 300 + i * 50;
    })
    .attr('opacity', 1)
;