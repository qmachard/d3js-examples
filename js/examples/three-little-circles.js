var circle = d3.selectAll('circle');

circle.style('fill', 'steelblue');

circle.data([32, 57, 112]);

circle.attr('r', function(d) {
    return Math.sqrt(d);
});

circle.attr('cx', function(d, i) {
    return i * 100 + 30;
});