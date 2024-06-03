const states = Array.from(new Set(divorceMonthly.map(d => d.Bundesland)));

const months = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

const nestedData = d3.group(divorceMonthly, d => d.Bundesland);

// Populate dropdown menu
const stateSelector = d3.select("#stateSelector");
stateSelector.selectAll("option")
    .data(states)
    .enter()
    .append("option")
    .text(d => d);

// Set initial state to display
updateChart(nestedData.get(states[0]));

// Update chart when a different state is selected
stateSelector.on("change", function () {
    const selectedState = this.value;
    const selectedData = nestedData.get(selectedState);
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

    groupedData.forEach((values, key) => {
        const lineData = months.map(month => ({
            month: month,
            value: d3.sum(values, d => d[`${month}_per_1k`])
        }));

        // Add the line to the chart
        svg.append("path")
            .datum(lineData)
            .attr("fill", "none")
            .attr("stroke", d3.schemeSet3[key % 12]) // Use D3 color scheme for different colors
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