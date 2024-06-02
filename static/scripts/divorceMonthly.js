const states = Array.from(new Set(divorceMonthly.map(d => d.Bundesland)));

const nestedData = d3.group(divorceMonthly, d => d.Bundesland);
const nestedDataCleaned = new Map([...nestedData].map(([key, value]) => [key.trim(), value]));

// Populate dropdown menu
const stateSelector = d3.select("#stateSelector");
stateSelector.selectAll("option")
    .data(states)
    .enter()
    .append("option")
    .text(d => d);

// Set initial state to display
updateChart(nestedDataCleaned.get(states[0]));

// Update chart when a different state is selected
stateSelector.on("change", function () {
    const selectedState = this.value;
    const selectedData = nestedDataCleaned.get(selectedState);
    updateChart(selectedData);
});

function updateChart(data) {
    // Clear any existing chart
    d3.select("#divorceMonthly").selectAll("*").remove();

    const parentContainer = document.getElementById('divorceMonthly').parentElement;
    const parentStyle = getComputedStyle(parentContainer);
    const parentWidth = parentContainer.clientWidth - parseFloat(parentStyle.marginLeft) - parseFloat(parentStyle.marginRight);

    // Set dimensions and margins
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = parentWidth - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#divorceMonthly")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scalePoint()
        .domain(["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"])
        .range([0, width-60]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max([d.Jänner, d.Februar, d.März, d.April, d.Mai, d.Juni, d.Juli, d.August, d.September, d.Oktober, d.November, d.Dezember]))])
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

    // Prepare data for each year
    const months = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

    groupedData.forEach((values, key) => {
        const lineData = months.map(month => ({
            month: month,
            value: d3.sum(values, d => d[month])
        }));

        // Add the line to the chart
        svg.append("path")
            .datum(lineData)
            .attr("fill", "none")
            .attr("stroke", d3.schemeCategory10[key % 10]) // Use D3 color scheme for different colors
            .attr("stroke-width", 1.5)
            .attr("d", line);
    });

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(groupedData.keys())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => d3.schemeSet3[i % 12]);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);
}