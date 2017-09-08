var dataset = [
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


function reloadDonut(data) {
    var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        })
    ;

    var arc = d3.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius)
    ;

    var paths = container.selectAll('path')
        .data(pie(data.data))
    ;

    // Add more paths if values are not the same
    paths
        .enter()
        .append("path")
        .attr('d', arc)
        .attr('class', 'arc')
        .style('fill', function(d) {
            return colors[d.index % colors.length];
        })
        .style('stroke', '#FFFFFF')
        // Interaction
        .on('mouseover', onPathOver)
        .on('mouseout', onPathOut)
    ;

    // Animation

    paths
        .transition()
        .duration(500)
        .attr('d', arc)
    ;

    paths.exit().remove();
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

reloadDonut(dataset[1]);

var radios = document.querySelectorAll('#selector input');
for(var j=0, radio; radio = radios[j]; j++) {
    radio.addEventListener('change', function() {
        reloadDonut(dataset[this.value]);
    })
}

