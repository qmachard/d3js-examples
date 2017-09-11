var height = 600,
    width = 800,
    margin = { top: 20, right: 20, bottom: 20, left: 40 },
    colors = ['#009999', '#008888', '#007777', '#006666', '#005555', '#004444', '#003333', '#002222']
;

// Interface elements
var page,
    keys,
    browsers,
    nextButton,
    prevButton
;

// Create SVG
var svg = d3.select('#chart').append('svg')
    .attr('height', height)
    .attr('width', width)
;

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

// Create container
var container = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
;

// Setup Scales
var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
var x1 = d3.scaleBand().padding(0.05);
var y = d3.scaleLinear().rangeRound([height, 0]);
var z = d3.scaleOrdinal().range(colors);

// Setup a DateTime parser
var parseTime = d3.timeParse("%Y-%m");

// Setup pagination
nextButton = d3.select('#pagination-next').on('click', function() {
    update(++page);
});

prevButton = d3.select('#pagination-prev').on('click', function() {
    update(--page);
});

/**
 * Transform CSV date to Javascript Date
 * @param d
 * @param _
 * @param columns
 * @returns {*}
 */
function type(d, _, columns) {
    d['Date'] = parseTime(d['Date']);
    for (var i = 1, n = columns.length, c; i < n; ++i) {
        d[c = columns[i]] = +d[c];
    }
    return d;
}

/**
 * Create a Chart
 *
 * @param data
 * @param keys
 */
function updateChart(data, keys) {
    // Init scales
    x0.domain(data.map(function(d) {
        return d.name;
    }));

    x1.domain(keys).rangeRound([0, x0.bandwidth()]);

    y.domain([0, d3.max(data, function(d) {
        return d3.max(d.data, function(item) {
            return item.value;
        })
    })]).nice();

    // Init data of each years
    var years = container.selectAll('.year')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'year')
        .attr('transform', function(d) {
            return 'translate(' + x0(d.name) + ')';
        })
    ;

    // Init data of each browsers
    var plots = years.selectAll('.plot')
        .data(function(d) {
            return d.data;
        })
        .enter()
        .append('rect')
        .attr('class', 'plot')
        .attr('x', function(d) {
            return x1(d.name);
        })
        .attr('y', height)
        .attr('height', 0)
        .attr('width', x1.bandwidth())
        .attr('fill', function(d) {
            return z(d.name);
        })
    ;

    var i = 0;

    // Plot update & animation
    container
        .selectAll('.year')
        .data(data)
        .selectAll('.plot')
        .data(function(d) {
            return d.data;
        })
        .transition()
        .duration(500)
        .delay(function (d) {
            var delay = i * 50;
            i++;
            return delay;
        })
        .attr('height', function(d) {
            return height - y(d.value);
        })
        .attr('y', function(d) {
            return y(d.value);
        })
    ;


    // Axi
    container.select('.axis')
        .transition()
        .duration(100)
        .remove()
    ;

    var axis = container.append('g')
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .transition()
        .duration(500)
        .delay(100)
        .call(d3.axisBottom(x0))
    ;

    plots.exit().remove();
    years.exit().remove();
}

/**
 * Method to update page
 * @param i
 */
function update(i) {
    if(i > 0) {
        prevButton.node().parentNode.classList.remove('disabled');
    } else {
        prevButton.node().parentNode.classList.add('disabled');
    }

    if(i < browsers.length - 5) {
        nextButton.node().parentNode.classList.remove('disabled');
    } else {
        nextButton.node().parentNode.classList.add('disabled');
    }

    updateChart(browsers.slice(i, i + 5), keys);
}

// Load data from CSV
d3.csv("https://raw.githubusercontent.com/datasets/browser-stats/master/data-extant.csv", type, function(error, data) {
    if (error) throw error;

    // Get keys
    keys = data.columns.slice(1);

    // Rearrange data from csv
    browsers = data.map(function(d) {
        var data = [];

        for(var i in d) {
            if (d.hasOwnProperty(i) && i !== "Date") {
                data.push({
                    name: i,
                    value: d[i]
                })
            }
        }

        return {
            name: d['Date'].getFullYear(),
            data: data
        }
    });

    // Limit data to 1 per year and limit since 5 years
    var currentYear;

    browsers = browsers.filter(function(d) {
        if(d.name !== currentYear) {
            currentYear = d.name;

            return d;
        }
    });

    page = browsers.length - 5;
    update(page);
});