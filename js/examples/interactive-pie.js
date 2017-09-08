var dataset = [
    {
        name: 2014,
        data: [
            { name: "Chrome", value: 10 },
            { name: "Firefox", value: 20 },
            { name: "IE / Edge", value: 50 },
            { name: "Safari", value: 9 },
            { name: "Opera", value: 2 },
            { name: "Autre", value: 1 }
        ]
    },
    {
        name: 2015,
        data: [
            { name: "Chrome", value: 40 },
            { name: "Firefox", value: 13 },
            { name: "IE / Edge", value: 20 },
            { name: "Safari", value: 9 },
            { name: "Opera", value: 2 },
            { name: "Autre", value: 1 }
        ]
    },
    {
        name: 2016,
        data: [
            { name: "Chrome", value: 44.87 },
            { name: "Firefox", value: 10.51 },
            { name: "IE / Edge", value: 11.24 },
            { name: "Safari", value: 13.06 },
            { name: "Opera", value: 5 },
            { name: "Autre", value: 2.43 }
        ]
    },
    {
        name: 2017,
        data: [
            { name: "Chrome", value: 50 },
            { name: "Firefox", value: 13.96 },
            { name: "IE / Edge", value: 12.70 },
            { name: "Safari", value: 9.60 },
            { name: "Opera", value: 4 },
            { name: "Autre", value: 3.53 }
        ]
    }

];

var width = 600,
    height = 400,
    radius = height / 2,
    colors = ['#009999', '#008888', '#007777', '#006666', '#005555', '#004444', '#003333', '#002222'],
    i = 0
;

var timeout;

var svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMinYMin')
;

var container = svg.append('g')
    .attr('transform', 'translate('+ width / 2 + ',' + height / 2 +')')
;

var arc = d3.arc()
    .innerRadius(radius * 0.7)
    .outerRadius(radius)
;

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

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}

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

function onPathOut(d) {
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

function onSelectYear(d) {
    reloadDonut(d);
}

function initSelector(data) {
    d3.select('#selector')
        .selectAll('div')
        .data(data)
        .enter()
        .append('div')
            .attr('class', 'form-check form-check-inline')
            .append('label')
                .attr('class', 'form-check-label')
                .attr('for', function(d, i) {
                    return 'year-' + i;
                })
                .text(function(d) {
                    return d.name;
                })
                .append('input')
                    .attr('type', 'radio')
                    .attr('class', 'form-check-input')
                    .attr('name', 'year')
                    .attr('id', function(d, i) {
                        return 'year-' + i;
                    })
                    .attr('value', function(d, i) {
                        return i;
                    })
                    .attr('checked', function(d, i) {
                        return (i == data.length - 1) ? 'checked' : null;
                    })
                    .on('change', onSelectYear)
    ;
}

initSelector(dataset);
reloadDonut(dataset[dataset.length - 1]);

