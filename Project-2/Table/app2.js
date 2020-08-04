$(document).ready(function() {

    boroFilter();
    raceFilter();
    genderFilter();
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
    $('#boro, #gender, #race').on("change", function(event) {
        event.preventDefault();
        buildTable();
    });
});

// Create dynamic Filters
function boroFilter() {
    $.ajax({
        type: "GET",
        url: "https://data.cityofnewyork.us/resource/833y-fsy8.json",
        dataType: 'json', // added data type
        success: function(data) {
            //console.log(data);

            //global
            var tableData = data;

            var boros = [...new Set(tableData.map(x => x.boro))];
            boros.sort();

            boros.forEach(function(boro) {
                let idunno = `<option>${boro}</option>`
                $('#boro').append(idunno);
            });
        }
    });
}

function raceFilter() {
    $.ajax({
        type: "GET",
        url: "https://data.cityofnewyork.us/resource/833y-fsy8.json",
        dataType: 'json', // added data type
        success: function(data) {
            //console.log(data);

            //global
            var tableData = data;

            var races = [...new Set(tableData.map(x => x.vic_race))];
            races.sort();

            races.forEach(function(race) {
                let idunno = `<option>${race}</option>`
                $('#race').append(idunno);
            });
        }
    });
}

function genderFilter() {
    $.ajax({
        type: "GET",
        url: "https://data.cityofnewyork.us/resource/833y-fsy8.json",
        dataType: 'json', // added data type
        success: function(data) {
            //console.log(data);

            //global
            var tableData = data;
            var genders = [...new Set(tableData.map(x => x.vic_sex))];
            genders.sort();

            genders.forEach(function(gender) {
                let idunno = `<option>${gender}</option>`
                $('#gender').append(idunno);
            });
        }
    });
}

// Build Table
function buildTable() {
    $.ajax({
        type: "GET",
        url: "https://data.cityofnewyork.us/resource/833y-fsy8.json",
        dataType: 'json', // added data type
        success: function(data) {
            console.log(data);

            //global
            var tableData = data;

            // Filters
            var dateInput = $('#date').val();
            var boroInput = $('#boro').val();
            var genderInput = $('#gender').val();
            var raceInput = $('#race').val();

            // Filter Data
            var sub_data = tableData;

            if (dateInput !== "") {
                sub_data = tableData.filter(x => Date.parse(x.occur_date.split(`T`)[0]) === Date.parse(dateInput));
            }
            if (boroInput != "All") {
                sub_data = sub_data.filter(x => x.boro === boroInput);
            }
            if (genderInput != "All") {
                sub_data = sub_data.filter(x => x.vic_sex === genderInput);
            }
            if (raceInput != "All") {
                sub_data = sub_data.filter(x => x.vic_race === raceInput);
            }

            $('#shootings-table').DataTable().clear().destroy(); //clear datatable
            $('#shootings-table tbody').empty();
            sub_data.forEach(function(thing) {
                let row = "<tr>"
                Object.entries(thing).forEach(function([key, value]) {
                    row += `<td>${value}</td>`;
                });
                row += "</tr>";
                $('#shootings-table tbody').append(row);
            });

            $('#shootings-table').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    'copyHtml5',
                    'csvHtml5',
                ]
            })
        }
    });
}