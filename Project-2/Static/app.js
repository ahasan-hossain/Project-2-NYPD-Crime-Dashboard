$(document).ready(function() {
    updateYear();
    makeBoroChart(2018);
    makeAgeChart(2018);
    makeLineChart(2018);
    makeMap();

    $('#yearFilter').change(function() {
        let year = $(this).val();
        makeBoroChart(year);
        makeAgeChart(year);
        makeLineChart(year);
    })
});

function makeMap() {
    //clear map
    $('#mapParent').empty();
    $('#mapParent').append('<div style="height: 500px" id="map"></div>');

    // Adding tile layer to the map
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });

    var icons = {
        all: L.ExtraMarkers.icon({
            icon: "ion-android-sad",
            iconColor: "white",
            markerColor: "blue-dark",
            shape: "star"
        }),
        deaths: L.ExtraMarkers.icon({
            icon: "ion-heart-broken",
            iconColor: "white",
            markerColor: "red",
            shape: "penta"
        }),
        noDeaths: L.ExtraMarkers.icon({
            icon: "ion-heart",
            iconColor: "white",
            markerColor: "green",
            shape: "circle"
        }),
        maleIcon: L.ExtraMarkers.icon({
            icon: "ion-male",
            iconColor: "white",
            markerColor: "blue",
            shape: "star"
        }),
        femaleIcon: L.ExtraMarkers.icon({
            icon: "ion-female",
            iconColor: "white",
            markerColor: "pink",
            shape: "star"
        }),
    };

    // Shootings Markers:
    var url = "https://data.cityofnewyork.us/resource/833y-fsy8.json";

    d3.json(url).then(function(response) {

                response.forEach(function(d) {
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
                })

                //create markers and heatmap
                var murd = L.markerClusterGroup();
                var noMurd = L.markerClusterGroup();
                var markers = L.markerClusterGroup();
                var genderM = L.markerClusterGroup();
                var genderF = L.markerClusterGroup();
                var heatArray = [];

                response.forEach(function(murder) {
                            if (murder.statistical_murder_flag === "YES") {
                                let yes = L.marker([+murder.latitude, +murder.longitude], {
                                        icon: icons.deaths,
                                    }).bindPopup(`<h5>${murder.location_desc}</h5><p>Borough: ${murder.boro}</p><p>Date: ${murder.occur_date.split(`T`)[0]}</p><p>Victim Race: ${murder.vic_race}</p><p>Victim Sex: ${murder.vic_sex}</p><p>Deaths: ${murder.statistical_murder_flag}</p>`);
                murd.addLayer(yes);
                heatArray.push([+murder.latitude, +murder.longitude]);
            } else {
                let no = L.marker([+murder.latitude, +murder.longitude], {
                    icon: icons.noDeaths,
                }).bindPopup(`<h5>${murder.location_desc}</h5><p>Borough: ${murder.boro}</p><p>Date: ${murder.occur_date.split(`T`)[0]}</p><p>Victim Race: ${murder.vic_race}</p><p>Victim Sex: ${murder.vic_sex}</p><p>Deaths: ${murder.statistical_murder_flag}</p>`);
                noMurd.addLayer(no);
                heatArray.push([+murder.latitude, +murder.longitude]);
            }

        });

        response.forEach(function(shoot) {
            if ((shoot.latitude) && (shoot.longitude)) {
                //marker for cluster
                let temp = L.marker([+shoot.latitude, +shoot.longitude], {
                    icon: icons.all,
                }).bindPopup(`<h5>${shoot.location_desc}</h5><p>Borough: ${shoot.boro}</p><p>Date: ${shoot.occur_date.split(`T`)[0]}</p><p>Victim Race: ${shoot.vic_race}</p><p>Victim Sex: ${shoot.vic_sex}</p><p>Deaths: ${shoot.statistical_murder_flag}</p>`);
                markers.addLayer(temp);

                //heatmap points
                heatArray.push([+shoot.latitude, +shoot.longitude]);
            }
        });

        response.forEach(function(gender) {
            if (gender.vic_sex === "MALE") {
                let male = L.marker([+gender.latitude, +gender.longitude], {
                    icon: icons.maleIcon,
                }).bindPopup(`<h5>${gender.location_desc}</h5><p><h5>Borough: ${gender.boro}</p><p>Date: ${gender.occur_date.split(`T`)[0]}</p><p>Victim Race: ${gender.vic_race}</p><p>Victim Sex: ${gender.vic_sex}</p><p>Deaths: ${gender.statistical_murder_flag}</h5>`);
                genderM.addLayer(male);
                heatArray.push([+gender.latitude, +gender.longitude]);
            } else {
                let female = L.marker([+gender.latitude, +gender.longitude], {
                    icon: icons.femaleIcon,
                }).bindPopup(`<h5>${gender.location_desc}</h5><p><h5>Borough: ${gender.boro}</p><p>Date: ${gender.occur_date.split(`T`)[0]}</p><p>Victim Race: ${gender.vic_race}</p><p>Victim Sex: ${gender.vic_sex}</p><p>Deaths: ${gender.statistical_murder_flag}</h5>`);
                genderF.addLayer(female);
                heatArray.push([+gender.latitude, +gender.longitude]);
            }

        });

        //Create Boro Outlines
        var boroOutlines = "Static/Map/boros.geojson"

        function chooseColor(borough) {
            switch (borough) {
                case "Brooklyn":
                    return "yellow";
                case "Bronx":
                    return "red";
                case "Manhattan":
                    return "orange";
                case "Queens":
                    return "green";
                case "Staten Island":
                    return "purple";
                default:
                    return "black";
            }
        }        

    d3.json(boroOutlines).then(function(boundaries) {
            var boroLayer = L.geoJson(boundaries, {
                style: function(feature) {
                    return {
                        color: chooseColor(feature.properties.borough),
                        fillOpacity: 0.009,
                        weight: 1
                    }
                },
            })

        //create heatmap layer
        var heat = L.heatLayer(heatArray, {
            radius: 70,
            blur: 35
        });

        // Create a baseMaps object to contain the streetmap and darkmap
        var baseMaps = {
            "Street": streetmap,
            "Dark": darkmap,
            "Light": lightmap,
            "Satellite": satellitemap
        };

        // Create an overlayMaps object here to contain the "State Population" and "City Population" layers
        var overlayMaps = {
            "Boros": boroLayer,
            "Heatmap": heat,
            "All Shootings": markers,
            "Fatalities": murd,
            "Non Fatalities": noMurd,
            "Male": genderM,
            "Female": genderF,
        };

        var baseTree = {
            label: 'Shootings By:',
            selectAllCheckbox: 'Un/select all',
            children: [{
                    label: 'Fatalities',
                    children: [
                        { label: "All", layer: markers },
                        { label: "Fatalities", layer: murd },
                        { label: "Non Fatalities", layer: noMurd },
                    ]
                },
                {
                    label: 'Shootings By Gender',
                    children: [
                        { label: 'Male', layer: genderM },
                        { label: 'Female', layer: genderF },
                    ]
                },
            ]
        };
    
        // Creating map object
        var myMap = L.map("map", {
            center: [40.73, -74.0059],
            zoom: 11,
            layers: [streetmap],
            fullscreenControl: true,
        });

        // Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    });
});
}

function makeBoroChart(year) {
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
                color: 'rgb(166, 166, 166)'
            }
        };

        var trace2 = {
            x: Object.keys(murderData),
            y: Object.values(murderData),
            name: 'Fatal Shootings',
            type: 'bar',
            marker: {
                color: 'rgb(165,0,0)'
            }
        };

        var data = [trace1, trace2];

        var layout = {
            title: 'Total Shootings By Borough',
            barmode: 'stack',
            xaxis: {
                title: {
                  text: 'Borough'
                }
            },
            yaxis: {
                title: {
                    text: 'Shootings (Fatal/Non-Fatal)'
                }
            }
        };

        Plotly.newPlot('bar', data, layout);
    });
}

function makeAgeChart(year) {
    d3.select("#h-bar").empty();
    d3.select("#h-bar").append();
    url = "https://data.cityofnewyork.us/resource/833y-fsy8.json?"
    var date = `$where=occur_date%20between%20%27${year}-01-01T00:00:00%27%20and%20%27${year+1}-01-01T00:00:00%27`;
    var fullUrl = url + date;
    //var dropdown = d3.select("#yearFilter");
    //dropdown.empty();
    var ages = []
    var fatalities = []
    d3.json(fullUrl).then(function(response) {
        var ages = response.map(x => x.vic_age_group);
        ages = [...new Set(ages)];
        var murderData = {};
        var nonFatalData = {};
        ages.forEach(ages => {
            let specAge = response.filter(x => x.vic_age_group === ages);
            let totalFatals = specAge.map(x => x.statistical_murder_flag).reduce((a, b) => a + b);
            murderData[ages] = totalFatals;
            let nonFatals = specAge.length - totalFatals;
            nonFatalData[ages] = nonFatals;
        });
        //x = plotData_Sorted.map(x => x[1]).slice(0, 10).reverse() //[1] corresponds to the sample_value
        //y = plotData_Sorted.map(x => "OTU " + x[0]).slice(0, 10).reverse() //[0] corresponds to the OTU ID (the OTU is neccessary to append)
        var trace1 = {
            y: Object.keys(nonFatalData),
            x: Object.values(nonFatalData),
            name: 'NonFatal Shootings',
            orientation: 'h',
            type: 'bar',
            marker: {
                color: 'rgb(166, 166, 166)'
            }
        };
        var trace2 = {
            y: Object.keys(murderData),
            x: Object.values(murderData),
            name: 'Fatal Shootings',
            orientation: 'h',
            type: 'bar',
            marker: {
                color: 'rgb(165,0,0)'
            }
        };
        var data = [trace1, trace2];
        var layout = {
            title: 'Total Shootings By Age Group',
            barmode: 'stack',
            xaxis: {
                title: {
                  text: 'Shootings (Fatal/Non-Fatal)'
                }
            },
            yaxis: {
                title: {
                    text: 'Age Group'
                }
            }
        };
        Plotly.newPlot('h-bar', data, layout);
    });
};

function makeLineChart(year) {
    d3.select("#line-graph").empty();
    d3.select("#line-graph").append();
    
    url = "https://data.cityofnewyork.us/resource/833y-fsy8.json?"
    
    var date = `$where=occur_date%20between%20%27${year}-01-01T00:00:00%27%20and%20%27${year+1}-01-01T00:00:00%27`;
    var fullUrl = url + date;
    //var dropdown = d3.select("#yearFilter");
    //dropdown.empty();
    var timeline = []
    var fatalities = []
    
    d3.json(fullUrl).then(function(response) {
        var timeline = response.map(x => x.occur_date);
        timeline = [...new Set(timeline)];
        var murderData = {};
        var nonFatalData = {};
        timeline.forEach(timeline => {
            let spectimeline = response.filter(x => x.occur_date === timeline);
            let totalFatals = spectimeline.map(x => x.statistical_murder_flag).reduce((a, b) => a + b);
            murderData[timeline] = totalFatals;
            let nonFatals = spectimeline.length - totalFatals;
            nonFatalData[timeline] = nonFatals;
        });
        let months = Object.keys(nonFatalData).map(x => (new Date(x)).getMonth());
        months = [...new Set(months)];
        let nonFatalDataMonth = {};
        let murderDataMonth = {};
        months.forEach(month => {
            let spectimeline = response.filter(x => (new Date(x.occur_date)).getMonth() === month);
            let totalFatals = spectimeline.map(x => x.statistical_murder_flag).reduce((a, b) => a + b);
            murderDataMonth[month] = totalFatals;
            //console.log(boroughs);
            let nonFatals = spectimeline.length - totalFatals;
            nonFatalDataMonth[month] = nonFatals;
        });

        var monthsAxis = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        //x = plotData_Sorted.map(x => x[1]).slice(0, 10).reverse() //[1] corresponds to the sample_value
        //y = plotData_Sorted.map(x => "OTU " + x[0]).slice(0, 10).reverse() //[0] corresponds to the OTU ID (the OTU is neccessary to append)
        var trace1 = {
            x: monthsAxis,
            y: Object.values(nonFatalDataMonth),
            name: 'NonFatal Shootings',
            type: 'line',
            marker: {
                color: 'rgb(165, 0, 0)'
            }
        };
        var trace2 = {
            x: monthsAxis,
            y: Object.values(murderDataMonth),
            name: 'Fatal Shootings',
            type: 'line',
            marker: {
                color: 'rgb(166, 166, 166)'
            }
        };
        var data = [trace1, trace2];
        var layout = {
            title: 'Total Shootings By Year',
            xaxis: { title: "Month" },
            yaxis: { title: "Shooting count" }
        };
        Plotly.newPlot('line-graph', data, layout);
    });
};

function updateYear() {
    let url = "https://data.cityofnewyork.us/resource/833y-fsy8.json?";

    d3.json(url).then(function(data) {
        var allDates = []
        var dates = data.map(x => {
            var date = x.occur_date.split("-", 1)
            allDates.push(date[0])
        })
        var allYears = [...new Set(allDates)]
        
        sortYears = allYears.sort(function(a, b){return b - a});

        d3.select('#yearFilter').selectAll('option')
        .data(sortYears)
        .enter()
        .append('option')
        .text(function (d) { 
            return d; })
        .attr("value", function (d) { return d; })
    })
};