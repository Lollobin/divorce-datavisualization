const states = Array.from(new Set(divorceMonthly.map(d => d.Bundesland)));

const months = ["J\u00E4nner", "Februar", "M\u00E4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// Populate dropdown menu
const stateSelector = d3.select("#stateSelector");
stateSelector.selectAll("option")
    .data(states)
    .enter()
    .append("option")
    .text(d => d);

// Update chart when a different state is selected
stateSelector.on("change", function () {
    const selectedState = this.value;
    const selectedData = nestedData.get(selectedState);
    updateMonthlyChart(selectedData);
});