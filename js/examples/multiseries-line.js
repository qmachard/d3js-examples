var height = 400,
    width = 600,
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    colors = ['#008080', '#5C9DE6', '#125EB3', '#8D3B23', '#B31E12']
;

// Setup a DateTime parser
var parseTime = d3.timeParse("%Y-%m");

// Create SVG
var svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', '100%')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMaxYMin')
;

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

// Create container
var graph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
;

// Setup scales
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

// Setup Axis
var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

// Setup zoom & area
var zoom = d3.zoom()
    .scaleExtent([1, 32])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', onZoom)
;

// Setup data binding on line
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) {
        return x(d.date);
    })
    .y(function(d) {
        return y(d.number);
    });

function onZoom() {
    var t = d3.event.transform,
        xt = t.rescaleX(x)
    ;

    // Method to rescale
    var zoomedLine = line.x(function(d) {
       return xt(d.date);
    });

    graph.selectAll(".line")
        .attr("d", function(d) {
            return zoomedLine(d.values);
        })
    ;

    graph.select(".axis--x")
        .call(xAxis.scale(xt))
    ;
}

// Load Data
d3.csv("../data/browser.csv", type, function(error, data) {
    if (error) throw error;

    // Rearrange data from csv
    var browsers = data.columns.slice(1).map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                var number = parseFloat(d[name]);

                return {
                    date: d['Date'],
                    number: isNaN(number) ? 0 : number
                }
            })
        }
    });

    // Setup scales with data
    x.domain(d3.extent(data, function(d) {
        return d['Date'];
    }));

    y.domain([
        d3.min(browsers, function(b) {
            return d3.min(b.values, function(d) {
                return d.number;
            });
        }),
        d3.max(browsers, function(b) {
            return d3.max(b.values, function(d) {
                return d.number;
            });
        })
    ]);

    z.domain(browsers.map(function(b) {
        return b.name;
    }));

    graph.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    graph.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("fill", "#000")
        .text("%");

    var browser = graph.selectAll('.browser')
        .data(browsers)
        .enter()
        .append('g')
        .attr('class', 'browser')
    ;

    var path = browser.append('path')
        .attr('class', 'line')
        .attr('d', function(d) {
            return line(d.values);
        })
        .style("stroke", function(d, i) {
            return colors[i % colors.length];
        })
    ;

    var dateEnd = d3.max(browsers, function(b) {
            return d3.max(b.values, function(d) {
                return d.date;
            })
        }),
        dateStart = (new Date(dateEnd)).setYear(dateEnd.getFullYear() - 1);

    console.log(dateStart, dateEnd);

    // Gratuitous intro zoom!
    svg.call(zoom).transition()
        .duration(1500)
        .call(zoom.transform, d3.zoomIdentity
            .scale(width / (x(dateEnd) - x(dateStart)))
            .translate(-x(dateStart), 0)
        );

    // // Label
    // browser.append("text")
    //     .datum(function(d) {
    //         return {
    //             name: d.name,
    //             value: d.values[d.values.length - 1]};
    //     })
    //     .attr("transform", function(d) {
    //         return "translate(" + x(d.value.date) + "," + y(d.value.number) + ")";
    //     })
    //     .attr("x", 3)
    //     .attr("dy", "0.35em")
    //     .style("font", "10px sans-serif")
    //     .style("fill", function(d, i) {
    //         return colors[i % colors.length];
    //     })
    //     .text(function(d) {
    //         return d.name;
    //     })
    //     .style('opacity', 0)
    //     .transition()
    //     .duration(500)
    //     .delay(2500)
    //     .style('opacity', 1)
    // ;

    // // Animations
    // path
    //     .attr("stroke-dasharray", function() {
    //         var totalLength = d3.select(this).node().getTotalLength();
    //         return totalLength + " " + totalLength
    //     })
    //     .attr("stroke-dashoffset", function() {
    //         return d3.select(this).node().getTotalLength();
    //     })
    //     .transition()
    //     .duration(3000)
    //     .ease(d3.easeSinInOut)
    //     .attr("stroke-dashoffset", 0)
    // ;
});

function type(d, _, columns) {
    d['Date'] = parseTime(d['Date']);
    for (var i = 1, n = columns.length, c; i < n; ++i) {
        d[c = columns[i]] = +d[c];
    }
    return d;
}