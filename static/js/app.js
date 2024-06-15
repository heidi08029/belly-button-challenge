// Build the metadata panel
function buildMetadata(sample) {
  //fetch the JSON data and console log it
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filterdata = metadata.filter(metadata => metadata.id == sample); 

    let result = filterdata[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata"); 

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    console.log(result);
    for (key in result) {
        panel.append("h6").text(`${key.toUpperCase()}:${result[key]}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filtersample = samples.filter(samples => samples.id == sample);

    let result2 = filtersample[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result2.otu_ids;
    let otu_labels = result2.otu_labels;
    let sample_values = result2.sample_values;


    // Build a Bubble Chart
    let layout1 = {
      title: "Bacteria Culturs Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"},
      hovermode: "closest",
    };

    // Render the Bubble Chart
    let bubledata = [{
      x: otu_ids, 
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker : {
                size:  sample_values, 
                color: otu_ids,
                colorscale: 'rgb(120,120,120)'
      }
    }
  ];

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    Plotly.newPlot("bubble", bubledata, layout1);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let yticks = otu_ids.map(otuID => `OTU ${otuID}`);


    let bardata = [
      {
        y: yticks.slice(0,10).reverse(),
        x: sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"

      }
    ];

    let layout2 = {
      title: "Top 10 Bacterial Cultures Found",
      margin: {l: 100,
        r: 100,
        t: 100,
        b: 100
    }
    };
    // Render the Bar Chart
    Plotly.newPlot("bar", bardata, layout2); 
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);

    // Get the names field
    let samplenames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selection = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < samplenames.length; i++){
      selection.append("option")
              .text(samplenames[i])
              .property("value",samplenames[i]);
  };

    // Get the first sample from the list

    let defaultsample = samplenames[0];
          buildCharts(defaultsample);
          buildMetadata(defaultsample);
      
    // Build charts and metadata panel with the first sample

  });
}

// Function for event listener
function optionChanged(newsample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newsample);
  buildMetadata(newsample);
}

// Initialize the dashboard
init();
