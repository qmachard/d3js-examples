// Random Dataset
var dataset = [];
var numDataPoints = 5;
var yRange = Math.random() * 1000;
for (var i = 0; i < numDataPoints; i++) {
    var newNumber1 = Math.round(Math.random() * yRange);
    dataset.push(newNumber1);
}

var h = 400,
    w = 600,
    radius = 200,
    padding = 10,
    colors = ['#009999', '#008888', '#007777', '#006666', '#005555', '#004444', '#003333', '#002222']
;

var svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 '+w+' '+h)
    .attr('preserveAspectRatio', 'xMinYMin')
;

var container = svg.append('g')
    .attr('transform', 'translate('+ w / 2 + ',' + h / 2 +')')
;

// Pie

var pie = d3.pie()
    .sort(null)
;

var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius / 2);

var path = container.selectAll(".arc")
    .data(pie(dataset))
    .enter()
    .append("g")
    .attr("class", "arc")
;

path.append("path")
    .attr("d", arc)
    .attr('stroke', 'white')
    .attr("fill", function(d, i) {
        return colors[i % colors.length];
    })
    .transition()
    .duration(1500)
    .attrTween("d", function(b) {
        b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(i(t)); };
    })
;