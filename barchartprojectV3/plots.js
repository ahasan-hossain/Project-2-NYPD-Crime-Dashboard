function buildMetadata(boro) {
    d3.json("https://data.cityofnewyork.us/resource/833y-fsy8.json").then((data) => {
        var boro = data.boro;
        // Filter the data for the object with the desired boro
        var resultArray = boro.filter(x => x.boro == boro);
        var result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-boro");

        // Use `.html("") to clear any existing data
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        //Object.entries(result).forEach(([key, value]) => {
        //      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        //});
    });
}

function makeBarPlot(id) {
    $.ajax({
        type: 'GET',
        url: "https://data.cityofnewyork.us/resource/833y-fsy8.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let sampleData = data["boros"].filter(x => x.boros == id)[0];
            console.log(sampleData)
                //BELOW IS THE FIRST WAY I DID IN OFFICE HOURS

            // // need to somehow sort by sample values, but keep the corresponding bacteria ID
            // // creates ONE object/dictionary thing
            // // I recommend you create a list of objects (one key/value per)
            // let plotData = Object.assign(...sampleData["otu_ids"].map((k, i) => ({
            //     [k]: sampleData["sample_values"][i]
            // })));
            // // sort the giant object by its values
            // //https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
            // let plotData_Sorted = Object.entries(plotData).sort((a, b) => b[1] - a[1]); //creates a sorted list of lists

            // x = plotData_Sorted.map(x => x[1]).slice(0, 10).reverse() //[1] corresponds to the sample_value
            // y = plotData_Sorted.map(x => "OTU " + x[0]).slice(0, 10).reverse() //[0] corresponds to the OTU ID (the OTU is neccessary to append)

            // THIS IS A BETTER WAY (skips the whole "turn into an object" part)

            //https://stackoverflow.com/questions/22015684/how-do-i-zip-two-arrays-in-javascript
            let plotData = sampleData["otu_ids"].map(function(e, i) {
                return [e, sampleData["sample_values"][i]]; //creates a list of list
            });
            let plotData_Sorted = plotData.sort((a, b) => b[1] - a[1]);
            x = plotData_Sorted.map(x => x[1]).slice(0, 10).reverse() //[1] corresponds to the sample_value
            y = plotData_Sorted.map(x => "OTU " + x[0]).slice(0, 10).reverse() //[0] corresponds to the OTU ID (the OTU is neccessary to append)

            // THE Y AXIS NEEDS TO BE A STRING, otherwise Plotly is dumb and thinks it is an INT. 
            var traces = [{
                type: 'bar',
                x: x,
                y: y,
                orientation: 'h',
                marker: {
                    color: x,
                    colorscale: 'Bluered'
                }
            }];

            var layout = {
                title: 'OTU Ids to Values'
            };

            Plotly.newPlot('bar', traces, layout);
        }
    });
}

function buildCharts(boro) {
    d3.json("https://data.cityofnewyork.us/resource/833y-fsy8.json").then((data) => {
        var samples = data.boros;
        var resultArray = samples.filter(boroObj => boroObj.id == boro);
        var result = resultArray[0];
        var female_vic = 0
        var male_vic = 0
        console.log("3");
        var eachMetadata = data.metadata
        eachMetadata.forEach((incident) => {
            console.log("4")
            if (incident.vic_sex == "F") {
                female_vic++;
            }
            if (incident.vic_sex == "M") {
                male_vic++;
            }
        })
        MandF_vic = [female_vic, male_vic]
        console.log(MandF_vic)
        var barData = [{
            y: MandF_vic,
            x: data.vic_sex,
            text: data.vic_sex,
            type: "bar",
            orientation: "h",
        }];
        console.log("5")
            //var barLayout = {
            //  title: "Incident between Men and Women",
            // margin: { t: 30, l: 150 }
            //};

        Plotly.newPlot("bar", barData);
    });
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    console.log("1")
        // Use the list of sample names to populate the select options
    d3.json("https://data.cityofnewyork.us/resource/833y-fsy8.json").then((data) => {
        console.log("2")
        var boroList = ["BRONX", "BROOKLYN", "QUEENS", "MANHATTAN", "STATEN ISLAND"]
        boroList.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = boroList[0];
        // makeBarPlot(firstSample)
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();