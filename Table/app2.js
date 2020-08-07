$.ajax({
    type: "GET",
    url: "https://data.cityofnewyork.us/resource/833y-fsy8.json?$select=incident_key,occur_date,boro,statistical_murder_flag,vic_age_group,vic_race,vic_sex",
    dataType: 'json',
    success: function(data) {
        console.log(data)

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

            var boros = [...new Set(data.map(x => x.boro))];
            boros.sort();

            boros.forEach(function(boro) {
                let idunno = `<option>${boro}</option>`
                $('#boro').append(idunno);
            });
        }

        function raceFilter() {

            var races = [...new Set(data.map(x => x.vic_race))];
            races.sort();

            races.forEach(function(race) {
                let idunno = `<option>${race}</option>`
                $('#race').append(idunno);
            });
        }

        function genderFilter() {

            var genders = [...new Set(data.map(x => x.vic_sex))];
            genders.sort();

            genders.forEach(function(gender) {
                let idunno = `<option>${gender}</option>`
                $('#gender').append(idunno);
            });
        }

        // Build Table
        function buildTable() {

            data.forEach(function(d) {
                if (d.vic_sex === "M") {
                    d.vic_sex = "MALE";
                } else {
                    d.vic_sex = "FEMALE";
                }
                if (d.statistical_murder_flag === true) {
                    d.statistical_murder_flag = "YES";
                } else {
                    d.statistical_murder_flag = "NO";
                }
                d.occur_date = d.occur_date.split('T')[0];
            })

            // Filters
            var dateInput = $('#date').val();
            var boroInput = $('#boro').val();
            var genderInput = $('#gender').val();
            var raceInput = $('#race').val();

            // Filter Data
            var sub_data = data;

            if (dateInput !== "") {
                sub_data = data.filter(x => Date.parse(x.occur_date.split(`T`)[0]) === Date.parse(dateInput));
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

            $('#shootings-table').DataTable().clear().destroy();
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
    }
})