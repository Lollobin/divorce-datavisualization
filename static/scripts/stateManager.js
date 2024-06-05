
const selectedState = document.getElementById("selectedState");

function changeState(newState){
    updateMonthlyChart(nestedData.get(newState));
    selectedState.innerHTML = newState;
}