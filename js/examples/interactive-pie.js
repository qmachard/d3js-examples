var width = 600,
    height = 400,
    radius = height / 2,
    colors = ['#009999', '#008888', '#007777', '#006666', '#005555', '#004444', '#003333', '#002222'],
    i = 0
;

var timeout;

// Create SVG
var svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMinYMin')
;

// Create Container to chart
var container = svg.append('g')
    .attr('transform', 'translate('+ width / 2 + ',' + height / 2 +')')
;

// Setup simple arc function
var arc = d3.arc()
    .innerRadius(radius * 0.7)
    .outerRadius(radius)
;

// Setup a DateTime parser
var parseTime = d3.timeParse("%Y-%m");

/**
 * Method to (re)load donut with data
 *
 * @param data
 */
function reloadDonut(data) {
    var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        })
    ;

    var paths = container.selectAll('path')
        .data(pie(data.data))
    ;

    // Add more paths if values are not the same
    paths
        .enter()
        .append("path")
        .attr('class', 'arc')
        .style('fill', function(d) {
            return colors[d.index % colors.length];
        })
        .style('stroke', '#FFFFFF')
        // Interaction
        .on('mouseover', onPathOver)
        .on('mouseout', onPathOut)
        .transition()
        .duration(500)
        .attrTween("d", arcTween)
    ;

    // Animation

    paths
        .transition()
        .duration(500)
        .attrTween("d", arcTween)
    ;

    paths.exit().remove();
}

/**
 * Method to animate arc
 *
 * @param a
 * @returns {Function}
 */
function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}

/**
 * Method call when a path is mouseover
 * @param d // data
 */
function onPathOver (d) {
    if(timeout) clearTimeout(timeout);

    d3
        .select('#chart')
        .select('.infos')
        .html('<span class="name">' + d.data.name + '</span><span class="value" style="color: ' + colors[d.index % colors.length] + '">' + d.data.value + ' %</span>')
        .transition()
        .duration(300)
        .style('opacity', 1)
    ;
}

/**
 * Method call when a path is mouse out
 */
function onPathOut() {
    timeout = setTimeout(function() {
        d3
            .select('#chart')
            .select('.infos')
            .transition()
            .duration(300)
            .style('opacity', 0)
        ;
    }, 1000);
}

/**
 * Method call when year is selected
 *
 * @param d
 */
function onSelectYear(d) {
    reloadDonut(d);
}

/**
 * Method to init year selector from data
 * @param data
 */
function initSelector(data) {
    var pageItem = d3.select('#selector')
        .selectAll('div')
        .data(data)
        .enter()
        .append('div')
            .attr('class', 'nav-item nav-link')
    ;

    var input = pageItem.append('input')
        .attr('type', 'radio')
        .attr('name', 'year')
        .attr('id', function(d, i) {
            return 'year-' + i;
        })
        .attr('value', function(d, i) {
            return i;
        })
        .attr('checked', function(d, i) {
            return i === data.length - 1 ? 'checked' : null;
        })
        .on('change', onSelectYear)
    ;

    var pageLink = pageItem.append('label')
        .attr('class', 'btn btn-default btn-sm')
        .attr('for', function(d, i) {
            return 'year-' + i;
        })
        .text(function(d) {
            return d.name;
        })
    ;

}

/**
 * Method to parse elements
 *
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

// Load data from CSV
d3.csv("../data/browser.txt", type, function(error, data) {
    if (error) throw error;

    // Rearrange data from csv
    var browsers = data.map(function(d) {
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

    // Limit data to 1 per year
    var currentYear;
    browsers = browsers.filter(function(d) {
        if(d.name !== currentYear) {
            currentYear = d.name;

            return d;
        }
    });

    initSelector(browsers);
    reloadDonut(browsers[browsers.length - 1]);
});

