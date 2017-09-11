var svg = d3.select('svg');

var circle = svg.selectAll("circle")
    .data([32, 57]);

circle.style("fill", "steelblue");
circle.attr("r", function(d) { return Math.sqrt(d); });
circle.attr("cx", function(d, i) { return i * 100 + 30; });

circle.exit().remove();