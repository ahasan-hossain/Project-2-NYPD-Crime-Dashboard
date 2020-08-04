// from data.js
var url = "https://data.cityofnewyork.us/resource/833y-fsy8.json";

d3.json(url).then(function(response) {
    console.log(response);

    // tbody 
    tbody = d3.select("tbody")

    // loop
    function displayData(tables) {
        tbody.text("")
        tables.forEach(function(ufos) {
            new_tr = tbody.append("tr")
            Object.entries(ufos).forEach(function([key, value]) {
                new_td = new_tr.append("td").text(value)
            })
        })
    }

    displayData(response)

    // Submit button
    var submit = d3.select("#submit");

    submit.on("click", function() {
        console.log("hello3")

        // Prevent the page from refreshing
        d3.event.preventDefault();

        // Input element
        var genderInput = d3.select("#gender");
        var raceInput = d3.select("#race");

        // Value property
        console.log(genderInput.property("value"));
        console.log(raceInput.property("value"));

        // Filters

        var filtered = response.filter(shootings => {
            return (shootings.vic_sex === genderInput.property("value") || !genderInput.property("value")) &&
                (shootings.vic_race === raceInput.property("value") || !raceInput.property("value"))
        })

        displayData(filtered);
    });

    var filterInputs = d3.selectAll('.form-control');

    // Clear input
    function clearEntries() {
        filters = {};

        filterInputs._groups[0].forEach(entry => {
            if (entry.value != 0) {
                d3.select('#' + entry.id).node().value = "";
            }
        });
    };

    var clearButton = d3.select("#clear");

    clearButton.on('click', function() {

        d3.event.preventDefault();
        clearEntries()
    });
});