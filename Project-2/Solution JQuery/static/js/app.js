var tableUrl = "https://data.cityofnewyork.us/resource/833y-fsy8.json";

$.ajax({
    url: tableUrl,
    data: data,
    success: success,
    dataType: dataType
});

$(document).ready(function() {
    // Load
    InsidentFilter();
    CountryFilter();
    ShapeFilter();
    buildTable();

    //Event Listeners
    $('#filter-btn').on("click", function(event) {
        event.preventDefault();
        buildTable();
    });
    $('#form').on("submit", function(event) {
        event.preventDefault();
        buildTable();
    });
    $('#insidentFilter, #countryFilter, #shapeFilter').on("change", function(event) {
        event.preventDefault();
        buildTable();
    });
});

// Filters
function InsidentFilter() {
    var incidentKey = [...new Set(url.map(x => x.incident_key))];
    incidentKey.sort();

    incidentKey.forEach(function(insident) {
        let idunno = `<option>${insident}</option>`
        $('#insidentFilter').append(idunno);
    });
}

function CountryFilter() {
    var countries = [...new Set(tableUrl.map(x => x.country))];
    countries.sort();

    countries.forEach(function(country) {
        let idunno = `<option>${country}</option>`
        $('#countryFilter').append(idunno);
    });
}

function ShapeFilter() {
    var shapes = [...new Set(tableUrl.map(x => x.shape))];
    shapes.sort();

    shapes.forEach(function(shape) {
        let idunno = `<option>${shape}</option>`
        $('#shapeFilter').append(idunno);
    });
}

// Table
function buildTable() {

    var inputValue = $('#datetime').val();
    var insidentFilter = $('#insidentFilter').val();
    var countryFilter = $('#countryFilter').val();
    var shapeFilter = $('#shapeFilter').val();

    var sub_data = tableUrl;
    if (inputValue !== "") {
        sub_data = tableUrl.filter(x => x.datetime === inputValue);
    }
    if (insidentFilter != "All") {
        sub_data = sub_data.filter(x => x.incident_key === insidentFilter);
    }
    if (countryFilter != "All") {
        sub_data = sub_data.filter(x => x.country === countryFilter);
    }
    if (shapeFilter != "All") {
        sub_data = sub_data.filter(x => x.shape === shapeFilter);
    }

    // Clear
    $('#ufo-table').DataTable().clear().destroy();
    $('#ufo-table tbody').empty();
    sub_data.forEach(function(thing) {
        let row = "<tr>"
        Object.entries(thing).forEach(function([key, value]) {
            row += `<td>${value}</td>`;
        });
        row += "</tr>";
        $('#ufo-table tbody').append(row);
    });
}