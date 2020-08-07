url = "https://data.cityofnewyork.us/resource/833y-fsy8.json"

d3.json(url, function(data) {
    console.log(data)

    const tableData = data;

    //var tableData = [
    //data.map(x => x.incident_key),
    //data.map(x => x.boro),
    //data.map(x => x.occur_date.split(`T`)[0]),
    //data.map(x => x.vic_sex),
    //data.map(x => x.vic_race)
    //];

    // get table references
    const tbody = d3.select("tbody");

    function buildTable(tables) {

        tables.forEach(function(shootings) {
            new_tr = tbody.append("tr")
            Object.entries(shootings).forEach(function([key, value]) {
                new_td = new_tr.append("td").text(value)
            })
        })
    }

    var submit = d3.select("#submit");

    submit.on("click", function() {
        // Prevent the page from refreshing
        d3.event.preventDefault();

        // Input element
        var dateInput = d3.select("#datetime");
        var boroInput = d3.select("#boro");
        var genderInput = d3.select("#genderFilter");
        var raceInput = d3.select("#race");

        var filteredData = tableData.filter(selectedData => {
            return (selectedData.occur_date.split(`T`)[0] === dateInput.property("value") || !dateInput.property("value")) &&
                (selectedData.boro === boroInput.property("value") || !boroInput.property("value")) &&
                (selectedData.vic_sex === genderInput.property("value") || !genderInput.property("value")) &&
                (selectedData.vic_race === raceInput.property("value") || !raceInput.property("value"))
        })

        buildTable(filteredData);
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

    // Build the table when the page loads
    buildTable(tableData);

});