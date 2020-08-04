$(document).ready(function() {
    makeChart(2018);
    updateYear()

    $('#yearFilter').change(function() {
        let year = $(this).val();
        makeChart(year);
    })
});


function makeChart(year) {
    d3.select("#bar").empty();
    d3.select("#bar").append();

    url = "https://data.cityofnewyork.us/resource/833y-fsy8.json?";

    var date = `$where=occur_date%20between%20%27${year}-01-01T00:00:00%27%20and%20%27${year+1}-01-01T00:00:00%27`;

    var fullUrl = url + date;

    var boroughs = []
    var fatalities = []

    d3.json(fullUrl).then(function(response) {
        var boroughs = response.map(x => x.boro);
        boroughs = [...new Set(boroughs)];

        var murderData = {};
        var nonFatalData = {};

        boroughs.forEach(borough => {
            let specBorough = response.filter(x => x.boro === borough);
            let totalFatals = specBorough.map(x => x.statistical_murder_flag).reduce((a, b) => a + b);
            murderData[borough] = totalFatals;

            let nonFatals = specBorough.length - totalFatals;
            nonFatalData[borough] = nonFatals;
        });

        var trace1 = {
            x: Object.keys(nonFatalData),
            y: Object.values(nonFatalData),
            name: 'NonFatal Shootings',
            type: 'bar',
            marker: {
                color: 'rgb(165,0,0)'
            }
        };

        var trace2 = {
            x: Object.keys(murderData),
            y: Object.values(murderData),
            name: 'Fatal Shootings',
            type: 'bar',
            marker: {
                color: 'rgb(198, 36, 28)'
            }
        };

        var data = [trace1, trace2];

        var layout = {
            title: 'Total Shootings By Borough',
            barmode: 'stack'
        };

        Plotly.newPlot('bar', data, layout);
    });
}

function updateYear() {
    let url = "https://data.cityofnewyork.us/resource/833y-fsy8.json?";

    d3.json(url).then(function(data) {
        var dates = data.map(x => x.occur_date);
        //console.log(dates)
        dates.forEach(date => {
            var years = date.split("-", 1);
            years = [...new Set(years)];
            console.log(years)
        })
    })
};