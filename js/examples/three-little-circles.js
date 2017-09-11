var svg = d3.select('svg');

var circle = svg.selectAll('circle')
    .data([32, 57, 112, 293])
;
circle.style("fill", "steelblue");
circle.attr("r", function(d) { return Math.sqrt(d); });
circle.attr("cx", function(d, i) { return i * 100 + 30; });

var circleEnter = circle.enter().append('circle');
circleEnter.style("fill", "steelblue");
circleEnter.attr("cy", 60);
circleEnter.attr("cx", function(d, i) { return i * 100 + 30; });
circleEnter.attr("r", function(d) { return Math.sqrt(d); });