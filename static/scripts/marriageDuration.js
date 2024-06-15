updatePieChart()

function updatePieChart() {
    // Set up dimensions and radius for the pie chart
    const width = 700;
    const height = 400;
    const radius = Math.min(width - 20, height - 20) / 2;

    const data = [{duration: "Unter 5 Jahre", percentage: 22.5}, {
        duration: "5 bis 10 Jahre",
        percentage: 25.7
    }, {duration: "10 bis 25 Jahre", percentage: 39.0}, {duration: "25+", percentage: 12.8}];

    var customColours = [
        '#c2636f', '#6395c2', '#8FBC8F', '#d8bfd8'
    ]

// Set up color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.duration))
        .range(customColours);

    // Set up pie layout
    const pie = d3.pie()
        .sort(null)
        .value(d => d.percentage)

    const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    const labelArc = d3.arc()
        .outerRadius(radius + 20)
        .innerRadius(radius + 20);

    // Create SVG element
    const svg = d3.select("#marriageDuration")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw slices of the pie chart
    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.duration))
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    arcs.append("text")
        .attr("transform", d => {
            const pos = labelArc.centroid(d);
            pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .attr("dy", "0.35em")
        .style("font-weight", "bold")
        .style("font-size", "1.2em")
        .style("text-anchor", d => (midAngle(d) < Math.PI ? "start" : "end"))
        .text(d => `${d.data.duration}: ${d.data.percentage}%`);

    arcs.append("polyline")
        .attr("points", function (d) {
            const pos = labelArc.centroid(d);
            pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return [arc.centroid(d), labelArc.centroid(d), pos];
        })
        .style("fill", "none")
        .style("stroke-width", 1.5)
        .style("stroke", "black");

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

}