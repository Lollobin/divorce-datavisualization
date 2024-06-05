const nestedData = d3.group(divorceMonthly, d => d.Bundesland);

// Calculate the global maximum value
const allLineValues = divorceMonthly.flatMap(d => [
    d.Jänner_per_1k, d.Februar_per_1k, d.März_per_1k, d.April_per_1k, d.Mai_per_1k,
    d.Juni_per_1k, d.Juli_per_1k, d.August_per_1k, d.September_per_1k,
    d.Oktober_per_1k, d.November_per_1k, d.Dezember_per_1k
]);
const globalMax = d3.max(allLineValues);

// Set initial state to display
updateMonthlyChart(nestedData.get(states[0]));

function updateMonthlyChart(data) {
    const parentContainer = document.getElementById('divorceMonthly').parentElement;
    const parentStyle = getComputedStyle(parentContainer);
    const parentWidth = parentContainer.clientWidth - parseFloat(parentStyle.marginLeft) - parseFloat(parentStyle.marginRight);

    // Set dimensions and margins
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = parentWidth - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // Create SVG container if it doesn't exist
    let svg = d3.select("#divorceMonthly svg");
    if (svg.empty()) {
        svg = d3.select("#divorceMonthly")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    } else {
        svg = svg.select("g");
    }

    // Create scales
    const x = d3.scalePoint()
        .domain(months)
        .range([0, width - 60]);

    const y = d3.scaleLinear()
        .domain([0, globalMax]) // Use global maximum for y-axis domain
        .range([height, 0]);

    // Create axes
    svg.selectAll(".x-axis").remove();
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.selectAll(".y-axis").remove();
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Create line generator
    const line = d3.line()
        .x(d => x(d.month))
        .y(d => y(d.value));

    // Group data by year
    const groupedData = d3.group(data, d => d.Jahr);

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
        .style("padding", "10px");

    const mousemove = function (d) {
        const tooltipText = `Jahr: ${d.toElement.__data__[0]["year"]}`;
        tooltip
            .html(tooltipText)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + "px");
    };

    const onLineClick = function (event, d) {

        d3.select(this)
            .attr("opacity", 1)
            .attr("stroke", colorScale(key));

        changeYear(d[0].year);
    };

    const onLegendClick = function (event, d){
        changeYear(d);
    };

    groupedData.forEach((values, key) => {
        const lineData = months.map(month => ({
            month: month,
            value: d3.sum(values, d => d[`${month}_per_1k`]),
            year: key
        }));

        // Bind data to lines
        let path = svg.selectAll(`.line-${key}`)
            .data([lineData]);

        // Update existing lines
        path.transition()
            .duration(1000)
            .attr("d", line)
            .attr("stroke", colorScale(key));

        // Add new lines
        path.enter()
            .append("path")
            .attr("class", `line line-${key}`)
            .attr("fill", "none")
            .attr("stroke", colorScale(key))
            .attr("stroke-width", 2)
            .attr("opacity", 0.7)
            .attr("d", line)
            .on("mouseenter", function () {
                d3.select(this)
                    .attr("stroke-width", 4)
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
                    .attr("stroke-width", 2)
                    .attr("stroke", colorScale(key));
                d3.select(`.legend-${key} rect`)
                    .attr("stroke", "none");
                tooltip
                    .style("opacity", 0)
                    .style("display", "none");
            })
            .on("mousemove", mousemove)
            .on("click", onLineClick);

        // Remove old lines
        path.exit().remove();
    });

    // Add legend
    let legend = svg.selectAll(".legend")
        .data(groupedData.keys());

    // Update existing legend entries
    legend.select("rect")
        .style("fill", d => colorScale(d));

    legend.select("text")
        .text(d => d);

    // Add new legend entries
    let legendEnter = legend.enter()
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
        })
        .on("click", onLegendClick);

    legendEnter.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => colorScale(d));

    legendEnter.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);

    // Remove old legend entries
    legend.exit().remove();
}