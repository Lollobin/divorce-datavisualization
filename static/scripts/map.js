


const dataByYear = {};
divorceLandPercent.forEach(item => {
    const year = item.Jahr
    delete item.Jahr

    if(year>=2005){
            dataByYear[year] = item;
    }

})


console.log(dataByYear)

const allValues = Object.values(dataByYear).flatMap(regionData => Object.values(regionData));

// Convert the comma-separated string values to numbers
const numericValues = allValues.map(value => parseFloat(value.replace(',', '.')));

// Find the minimum and maximum values using Array.reduce()
const min = numericValues.reduce((acc, curr) => Math.min(acc, curr), Number.MAX_VALUE);
const max = numericValues.reduce((acc, curr) => Math.max(acc, curr), Number.MIN_VALUE);

console.log("Minimum value:", min);
console.log("Maximum value:", max);


// Set the dimensions and margins of the graph
const map_margin = {top: 10, right: 30, bottom: 30, left: 60},
    map_width = 800 - map_margin.left - map_margin.right,
    map_height = 400 - map_margin.top - map_margin.bottom;


// Adjust color scale domain
var colorScale = d3.scaleLinear()
    .domain([min, max])
    .range(["white", "blue"])

// Append the svg object to the body of the page
const mapDiv = d3.select("#map")
    .append("svg")
    .attr("width", map_width + map_margin.left + map_margin.right)
    .attr("height", map_height + map_margin.top + map_margin.bottom)
    .append("g")
    .attr("transform", `translate(${map_margin.left},${map_margin.top})`);

function changeMapYear(year){
    mapDiv.selectAll(".mapfield")
        .transition()
        .duration(200)
        .attr("fill", function (d) {
        const bundesland = d.properties["name"];
        return colorScale(parseFloat(dataByYear[year][bundesland]));
    })
}

const slider = document.getElementById("yearSlider");
const selectedYear = document.getElementById("selectedYear");
slider.oninput = function (){
    changeMapYear(slider.value);
    selectedYear.innerHTML = slider.value;
}

slider.style.width = "70%";

var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(4000)
    .center([15, 47.7])
    .translate([map_width / 2, map_height / 2]);

let mouseOver = function (d) {
    d3.selectAll(".mapfield")
        .transition()
        .duration(100)
        .style("stroke", "white")
        .style("opacity", .5)
    d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
}


let mouseLeave = function (d) {
    d3.selectAll(".mapfield")
        .transition()
        .duration(100)
        .style("opacity", .8)
    d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "white")
}

let onClick = function (event, d) {
    console.log(d.properties.name)
}


console.log(divorceLandPercent)

mapDiv.append("g")
    .selectAll("path")
    .data(austriaMap.features)
    .enter()
    .append("path")
    .attr("fill", function (d) {
        const bundesland = d.properties["name"];
        return colorScale(parseFloat(dataByYear[slider.value][bundesland]));
    })
    .attr("d", d3.geoPath()
        .projection(projection)
    )
    .style("stroke", "white")
    .style("opacity", .8)
    .attr("class", "mapfield")
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("click", onClick)


