const nestedData = d3.group(divorceMonthly, d => d.Bundesland);

// Set initial state to display
updateMonthlyChart(nestedData.get(states[0]));

function updateMonthlyChart(data) {
    // Clear any existing chart
    d3.select("#divorceMonthly").selectAll("*").remove();

    const parentContainer = document.getElementById('divorceMonthly').parentElement;
    const parentStyle = getComputedStyle(parentContainer);
    const parentWidth = parentContainer.clientWidth - parseFloat(parentStyle.marginLeft) - parseFloat(parentStyle.marginRight);

    // Set dimensions and margins
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = parentWidth - margin.top - margin.bottom,
        height = 650 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#divorceMonthly")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scalePoint()
        .domain(months)
        .range([0, width - 60]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max([d.Jänner_per_1k, d.Februar_per_1k, d.März_per_1k, d.April_per_1k, d.Mai_per_1k, d.Juni_per_1k, d.Juli_per_1k, d.August_per_1k, d.September_per_1k, d.Oktober_per_1k, d.November_per_1k, d.Dezember_per_1k]))])
        .range([height, 0]);

    // Create axes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));


    // Create line generator
    const line = d3.line()
        .x(d => x(d.month))
        .y(d => y(d.value));

    // Group data by year
    const groupedData = d3.group(data, d => d.Jahr);
    const lines = {};

    // Define color scale
    const colorScale = d3.scaleOrdinal(d3.schemeSet3)
        .domain(Array.from(groupedData.keys()));

    const tooltip = d3.select("#divorceMonthly")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    const mousemove = function (d) {
        const tooltipText = `Jahr: ${d.toElement.__data__[0]["year"]}`;
        tooltip
            .html(tooltipText)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + "px")
    }

    groupedData.forEach((values, key) => {
        const lineData = months.map(month => ({
            month: month,
            value: d3.sum(values, d => d[`${month}_per_1k`]),
            year: key
        }));

        // Add the line to the chart
        lines[key] = svg.append("path")
            .datum(lineData)
            .attr("fill", "none")
            .attr("stroke",colorScale(key)) // Use D3 color scheme for different colors
            .attr("stroke-width", 1.5)
            .attr("class", `line line-${key}`)
            .on("mouseenter", function () {
                d3.select(this)
                    .attr("stroke-width", 3)
                    .attr("stroke", colorScale(key));
                d3.select(`.legend-${key} rect`)
                    .attr("stroke", colorScale(key))
                    .attr("stroke-width", 2);
                tooltip
                    .style("opacity", 1)
                    .style("display", "inline");
            })
            .on("mouseleave", function () {
                d3.select(this)
                    .attr("stroke-width", 1.5)
                    .attr("stroke", colorScale(key));
                d3.select(`.legend-${key} rect`)
                    .attr("stroke", "none");
                tooltip
                    .style("opacity", 0)
                    .style("display", "none");
            })
            .on("mousemove", mousemove)
            .attr("d", line);
    });

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(groupedData.keys())
        .enter()
        .append("g")
        .attr("class", d => `legend legend-${d}`)
        .attr("transform", (d, i) => `translate(0,${i * 20})`)
        .on("mouseenter", function (event, d) {
            d3.select(`.line-${d}`)
                .attr("stroke-width", 3)
                .attr("stroke", colorScale(d));
            d3.select(this).select("rect")
                .attr("stroke", colorScale(d))
                .attr("stroke-width", 2);
        })
        .on("mouseleave", function (event, d) {
            d3.select(`.line-${d}`)
                .attr("stroke-width", 1.5)
                .attr("stroke", colorScale(d));
            d3.select(this).select("rect")
                .attr("stroke", "none");
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => colorScale(d));

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);
}