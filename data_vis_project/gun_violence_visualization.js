var state_to_fips = {
   "Alabama"                :  "01",
   "Alaska"                 :  "02",
   "Arizona"                :  "04",
   "Arkansas"               :  "05",
   "California"             :  "06",
   "Colorado"               :  "08",
   "Connecticut"            :  "09",
   "Delaware"               :  "10",
   "District of Columbia"   :  "11",
   "Florida"                :  "12",
   "Georgia"                 :  "13",
   "Hawaii"                 :  "15",
   "Idaho"                  :  "16",
   "Illinois"               :  "17",
   "Indiana"                :  "18",
   "Iowa"                   :  "19",
   "Kansas"                 :  "20",
   "Kentucky"               :  "21",
   "Louisiana"              :  "22",
   "Maine"                  :  "23",
   "Maryland"               :  "24",
   "Massachusetts"          :  "25",
   "Michigan"               :  "26",
   "Minnesota"              :  "27",
   "Mississippi"            :  "28",
   "Missouri"               :  "29",
   "Montana"                :  "30",
   "Nebraska"               :  "31",
   "Nevada"                 :  "32",
   "New Hampshire"          :  "33",
   "New Jersey"             :  "34",
   "New Mexico"             :  "35",
   "New York"               :  "36",
   "North Carolina"         :  "37",
   "North Dakota"           :  "38",
   "Ohio"                   :  "39",
   "Oklahoma"               :  "40",
   "Oregon"                 :  "41",
   "Pennsylvania"           :  "42",
   "Rhode Island"           :  "44",
   "South Carolina"         :  "45",
   "South Dakota"           :  "46",
   "Tennessee"              :  "47",
   "Texas"                  :  "48",
   "Utah"                   :  "49",
   "Vermont"                :  "50",
   "Virginia"               :  "51",
   "Washington"             :  "53",
   "West Virginia"          :  "54",
   "Wisconsin"              :  "55",
   "Wyoming"                :  "56"
}

var abbrev_to_state = {
	'AL': 'Alabama',
	'AK': 'Alaska',
	'AZ': 'Arizona',
	'AR': 'Arkansas',
	'CA': 'California',
	'CO': 'Colorado',
	'CT': 'Connecticut',
	'DE': 'Delaware',
	'DC': 'District of Columbia',
	'FL': 'Florida',
	'GA': 'Georgia',
	'HI': 'Hawaii',
	'ID': 'Idaho',
	'IL': 'Illinois',
	'IN': 'Indiana',
	'IA': 'Iowa',
	'KS': 'Kansas',
	'KY': 'Kentucky',
	'LA': 'Louisiana',
	'ME': 'Maine',
	'MD': 'Maryland',
	'MA': 'Massachusetts',
	'MI': 'Michigan',
	'MN': 'Minnesota',
	'MS': 'Mississippi',
	'MO': 'Missouri',
	'MT': 'Montana',
	'NE': 'Nebraska',
	'NV': 'Nevada',
	'NH': 'New Hampshire',
	'NJ': 'New Jersey',
	'NM': 'New Mexico',
	'NY': 'New York',
	'NC': 'North Carolina',
	'ND': 'North Dakota',
	'OH': 'Ohio',
	'OK': 'Oklahoma',
	'OR': 'Oregon',
	'PA': 'Pennsylvania',
	'RI': 'Rhode Island',
	'SC': 'South Carolina',
	'SD': 'South Dakota',
	'TN': 'Tennessee',
	'TX': 'Texas',
	'UT': 'Utah',
	'VT': 'Vermont',
	'VA': 'Virginia',
	'WA': 'Washington',
	'WV': 'West Virginia',
	'WI': 'Wisconsin',
	'WY': 'Wyoming'
}

// var shooting_type = {
//     "mass_shooting": 0,
//     "police_shooting": 1
// }

var shooting_data = {
    mass_shooting: {
        scheme: "d3.schemeBlues[9]"
    },
    police_shooting: {
        scheme: "d3.schemeGreens[9]"
    },
    gun_violence: {
        scheme: "d3.schemeReds[9]"
    }
}

function graph_map(path_array) {
	var width = 1960;
	var height = 1000;
	var pad = 30
	d3.select('body').append('svg').attr('width', width).attr('height', height)

    var promises = [];
    path_array.forEach(function(path) {
        promises.push(formatCSV(path))
    });

    Promise.all(promises).then(function(values) {
        formatData(values);
        plot_it(width, height, values);
        add_slider(600, 600, pad, shooting_data.mass_shooting);
    });
}

async function formatCSV(path) {
	var data = await d3.csv(path, function(d) {
		if (d.date) {
			// add year to data
            if (path.includes("general")) {
                d.Year = d.date.split("-")[0];
            } else {
    			var year = d.date.split("/")[2];
                if (path.includes("police")) {
                    year = "20" + year;
                }
    			d.Year = year;
            }
            if (d.state.length == 2) {
                d.state = abbrev_to_state[d.state];
            }
            // add fips id to data
            d.fips = state_to_fips[d.state];
		}
		return d;
	})
    return data;
}

function formatData(data_array){
    shooting_data.mass_shooting.data = data_array[0];
    shooting_data.police_shooting.data = data_array[1];
    shooting_data.gun_violence.data = data_array[2];

    // skim data from parsed shootings data file
    for (var i = 0; i < data_array.length; i++) {
        var map_data = data_array[i];
        var shootings_count = {};
        var yearly_shootings = {};
		var fips_array = Object.values(state_to_fips);
        var min_year = parseInt(d3.min(map_data, d => d.Year));
    	var max_year = parseInt(d3.max(map_data, d => d.Year));

        for (var j = 0; j < max_year - min_year + 1; j++) {
            yearly_shootings[min_year + j] = {};
        }
		fips_array.forEach(function(d) {
			shootings_count[d] = 0;
            for (var year in yearly_shootings) {
                yearly_shootings[year][d] = 0;
            }
		});

		map_data.forEach(function(d) {
			shootings_count[d.fips] += 1;
            yearly_shootings[parseInt(d.Year)][d.fips] += 1;
		});

        if (i === 0) {
            shooting_data.mass_shooting.total_shootings = shootings_count;
            shooting_data.mass_shooting.yearly_shootings = yearly_shootings;
        } else if (i == 1) {
            shooting_data.police_shooting.total_shootings = shootings_count;
            shooting_data.police_shooting.yearly_shootings = yearly_shootings;
        } else if (i == 2){
            shooting_data.gun_violence.total_shootings = shootings_count;
            shooting_data.gun_violence.yearly_shootings = yearly_shootings;
        }

        console.log(shooting_data);
    }
}

// taken from the choropleth.js file from lecture in CS 3891 Data Visualization
function plot_it(width, height, datasets)  {
	var path = d3.geoPath();

	// initially display mass shootings data
    var min = 0;
    var max = 0;
    for (var year in shooting_data.mass_shooting.yearly_shootings) {
        var values = Object.values(shooting_data.mass_shooting.yearly_shootings[year]);
        var temp_min = Math.min(...values);
        var temp_max = Math.max(...values);
        min = min < temp_min ? min : temp_min;
        max = max > temp_max ? max : temp_max;
    }

	color = d3.scaleQuantize()
	    .domain([min, max])
	    .range(eval(shooting_data.mass_shooting.scheme));

	var svg = d3.select('svg');

	var g = svg.append("g")
	  .attr("transform", "translate(0,40)");

	// var x = d3.scaleLinear()
	// 	.domain(d3.extent(color.domain()))
	// 	.rangeRound([600, 860]);

	state_geometries = topojson.feature(us, us.objects.states).features
	svg.append("g")
		.selectAll("path")
		.data(state_geometries)
		.enter().append("path")
		  .attr("class", "state")
		  .attr("d", path)
          .attr("id", function(d) {return d.id})
	  	  .attr("fill", function(d) {
              return color(shooting_data.mass_shooting.yearly_shootings[1969][d.id]);
	  	  })

	  //.datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
	// console.log(us.objects.states)
	svg.append("path")
	  .datum(topojson.mesh(us, us.objects.states))
	  .attr("fill", "none")
	  .attr("stroke", "black")
	  .attr("stroke-linejoin", "round")
	  .attr("d", path);

	// button event handlers for switching data views
	d3.select('#mass_shooting_button').on('click', function(d) {
        update_slider(shooting_data.mass_shooting);
		display_map(shooting_data.mass_shooting, 1969); //1969 is default value in slider
	});

	d3.select('#police_killings_button').on('click', function(d) {
        update_slider(shooting_data.police_shooting);
		display_map(shooting_data.police_shooting, 2015);
	});

    d3.select('#gun_violence_button').on('click', function(d) {
        update_slider(shooting_data.gun_violence);
        display_map(shooting_data.gun_violence, 2013);
    });

	// d3.select('#gun_violence_button').on('click', function(d) {
	// 	display_map(shootings_dataset[3]);
	// });
}

// function for updating the data views
function display_map(dataset, year) {
    var min = 0;
    var max = 0;
    for (var temp_year in dataset.yearly_shootings) {
        var values = Object.values(dataset.yearly_shootings[temp_year]);
        var temp_min = Math.min(...values);
        var temp_max = Math.max(...values);
        min = min < temp_min ? min : temp_min;
        max = max > temp_max ? max : temp_max;
    }

    color = d3.scaleQuantize()
        .domain([min, max])
        .range(eval(dataset.scheme));

    d3.select("svg").selectAll('.state')
          .attr("fill", function() {
              var id = d3.select(this).attr("id");
              return color(dataset.yearly_shootings[year][id]);
          })
}

// Draws a slider based on the data chosen.
function add_slider(width, height, pad, dataset){
    var map_data = dataset.data;
    var min_year = parseInt(d3.min(map_data, d => d.Year));
    var max_year = parseInt(d3.max(map_data, d => d.Year));
    var time_range = d3.range(0, max_year - min_year + 1).map(function (d) { return new Date(min_year + d, 10, 3);});

    //TODO: Figure out how to throttle the slider so it doesn't refresh so often
    var slider = d3.sliderHorizontal()
      .min(d3.min(time_range))
      .max(d3.max(time_range))
      .step(1000 * 60 * 60 * 24 * 365)
      .width(width)
      .tickFormat(d3.timeFormat('%Y'))
      .on('onchange', val => {
          display_map(dataset, val.getFullYear());
      });
      // .on('onchange', _.throttle( val => {
      //     console.log(val.getFullYear())
      // }, 100));

      if (time_range.length > 10) {
          var new_time_range = []
          for (var i = 0; i < time_range.length; i++) {
              if (i % 3 === 0) {
                  new_time_range.push(time_range[i]);
              }
          }
          slider.tickValues(new_time_range);
      } else {
          slider.tickValues(time_range);
      }

    d3.select("svg")
    .append("g")
    .attr("id", "slider")
    .attr("transform", "translate(" + (pad) + "," + (height + pad) + ")")
    .call(slider);
}

function update_slider(dataset) {
    var slider = d3.select("svg").selectAll("g")
        .filter(function(d) {
            return d3.select(this).attr("id") == "slider"
        })
        .remove();
    if (dataset == shooting_data.mass_shooting) {
        add_slider(600, 600, 30, dataset);
    } else if (dataset == shooting_data.police_shooting) {
        add_slider(200, 600, 30, dataset);
    } else if (dataset == shooting_data.gun_violence) {
        add_slider(200, 600, 30, dataset);
    }
}
