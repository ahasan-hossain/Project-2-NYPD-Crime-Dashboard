$(document).ready(function() {
    makeMap();
});

function makeMap() {
    //clear map
    $('#mapParent').empty();
    $('#mapParent').append('<div style="height:700px" id="map"></div>');

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


    // TODO:
    var url = "https://data.cityofnewyork.us/resource/833y-fsy8.json";

    d3.json(url).then(function(response) {
                console.log(response);

                //create markers and heatmap
                var murd = L.markerClusterGroup();
                var noMurd = L.markerClusterGroup();
                var markers = L.markerClusterGroup();
                var genderM = L.markerClusterGroup();
                var genderF = L.markerClusterGroup();
                var heatArray = [];

                response.forEach(function(murder) {
                            if (murder.statistical_murder_flag === true) {
                                let yes = L.marker([+murder.latitude, +murder.longitude], {
                                        icon: icons.deaths,
                                    }).bindPopup(`<h3>${murder.location_desc}</h3><hr><h5>Borough: ${murder.boro}</h5><br><h5>Date: ${murder.occur_date.split(`T`)[0]}</h5><br><h5>Victim Race: ${murder.vic_race}</h5><br><h5>Victim Sex: ${murder.vic_sex}</h5><br><h5>Deaths: ${murder.statistical_murder_flag}</h5>`);
                murd.addLayer(yes);
                heatArray.push([+murder.latitude, +murder.longitude]);
            } else {
                let no = L.marker([+murder.latitude, +murder.longitude], {
                    icon: icons.noDeaths,
                }).bindPopup(`<h3>${murder.location_desc}</h3><hr><h5>Borough: ${murder.boro}</h5><br><h5>Date: ${murder.occur_date.split(`T`)[0]}</h5><br><h5>Victim Race: ${murder.vic_race}</h5><br><h5>Victim Sex: ${murder.vic_sex}</h5><br><h5>Deaths: ${murder.statistical_murder_flag}</h5>`);
                noMurd.addLayer(no);
                heatArray.push([+murder.latitude, +murder.longitude]);
            }

        });

        response.forEach(function(shoot) {
            if ((shoot.latitude) && (shoot.longitude)) {
                //marker for cluster
                let temp = L.marker([+shoot.latitude, +shoot.longitude], {
                    icon: icons.all,
                }).bindPopup(`<h3>${shoot.location_desc}</h3><hr><h5>Borough: ${shoot.boro}</h5><br><h5>Date: ${shoot.occur_date.split(`T`)[0]}</h5><br><h5>Victim Race: ${shoot.vic_race}</h5><br><h5>Victim Sex: ${shoot.vic_sex}</h5><br><h5>Deaths: ${shoot.statistical_murder_flag}</h5>`);
                markers.addLayer(temp);

                //heatmap points
                heatArray.push([+shoot.latitude, +shoot.longitude]);
            }
        });

        response.forEach(function(gender) {
            if (gender.vic_sex === "M") {
                let male = L.marker([+gender.latitude, +gender.longitude], {
                    icon: icons.maleIcon,
                }).bindPopup(`<h3>${gender.location_desc}</h3><hr><h5>Borough: ${gender.boro}</h5><br><h5>Date: ${gender.occur_date.split(`T`)[0]}</h5><br><h5>Victim Race: ${gender.vic_race}</h5><br><h5>Victim Sex: ${gender.vic_sex}</h5><br><h5>Deaths: ${gender.statistical_murder_flag}</h5>`);
                genderM.addLayer(male);
                heatArray.push([+gender.latitude, +gender.longitude]);
            } else {
                let female = L.marker([+gender.latitude, +gender.longitude], {
                    icon: icons.femaleIcon,
                }).bindPopup(`<h3>${gender.location_desc}</h3><hr><h5>Borough: ${gender.boro}</h5><br><h5>Date: ${gender.occur_date.split(`T`)[0]}</h5><br><h5>Victim Race: ${gender.vic_race}</h5><br><h5>Victim Sex: ${gender.vic_sex}</h5><br><h5>Deaths: ${gender.statistical_murder_flag}</h5>`);
                genderF.addLayer(female);
                heatArray.push([+gender.latitude, +gender.longitude]);
            }

        });


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
        //myMap.addLayer(murd, noMurd);
        //L.control.layers.tree(baseTree).addTo(myMap);
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    });
}