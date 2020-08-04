url = "https://data.cityofnewyork.us/resource/833y-fsy8.json"
var dropdown = d3.select("#sel");
dropdown.empty();

var boroughs = []
var fatalities = []

d3.json(url).then(function(response) {
    var boroughs = response.map(x => x.boro);
    boroughs = [...new Set(boroughs)];

    var murderData = {};
    var nonFatalData = {};

    boroughs.forEach(borough => {
        let specBorough = response.filter(x => x.boro === borough);
        let totalFatals = specBorough.map(x => x.statistical_murder_flag).reduce((a, b) => a + b);
        murderData[borough] = totalFatals;

        console.log(boroughs);
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