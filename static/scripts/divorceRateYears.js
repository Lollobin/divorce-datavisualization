// Set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#divorceRateYears")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the data
const data = divorceRate.map(d => ({
    year: +d.Jahr,
    rate: +d.Gesamtscheidungsrate.replace(',', '.')
}));

// X axis
const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);

svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

// Y axis
const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.rate)])
    .range([height, 0]);

svg.append("g")
    .call(d3.axisLeft(y));

// Add the line
svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
        .x(d => x(d.year))
        .y(d => y(d.rate))
    );