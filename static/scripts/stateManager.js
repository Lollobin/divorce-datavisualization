const selectedState = document.getElementById("selectedState");

function changeState(newState) {
    updateMonthlyChart(nestedData.get(newState));
    selectedState.innerHTML = newState;
}

selectedState.innerHTML = states[0];

function deselectStates() {
    d3.selectAll(".mapfield")
        .style("stroke", "white")
        .style("stroke-width", 1.5);
    updateMonthlyChart(nestedData.get(states[0]));
    selectedState.innerHTML = states[0];
}

function changeYear(newYear) {
    slider.value = newYear;
    changeMapYear(slider.value);
    selectedYear.innerHTML = slider.value;
}