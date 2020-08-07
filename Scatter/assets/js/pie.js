url = "https://data.cityofnewyork.us/resource/833y-fsy8.json"

d3.json(fullUrl).then(function(response) {
            console.log(data);



            var trace1 = {
                labels: data.vic_sex,
                type: 'pie'
            };

            var data = [trace1];

            var layout = {
                title: "Pie Chart",
            };

            Plotly.newPlot("plot", data, layout);