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
	var height = 680;
	var pad = 30;
	d3.select('body').append('svg').attr('width', width).attr('height', height);

    var promises = [];
    path_array.forEach(function(path) {
        promises.push(formatCSV(path));
    });

    Promise.all(promises).then(function(values) {
        formatData(values);
        plot_it(width, height, values);
        add_slider(600, 600, pad, shooting_data.mass_shooting);
        plot_parallel_coordinates(1000, 600, 400, pad);
        formatLineData(shooting_data.mass_shooting);
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

        // console.log(shooting_data);
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
        .on('mouseover', show_line_graph)
        .on('mouseout', function(d) {
          // TODO: remove the line graph once mouse leaves state
          hide_line_graph(d);
          console.log('mouse left');
        })

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
        formatLineData(shooting_data.mass_shooting);
	});
	d3.select('#police_killings_button').on('click', function(d) {
        update_slider(shooting_data.police_shooting);
    		display_map(shooting_data.police_shooting, 2015);
        formatLineData(shooting_data.police_shooting);
	});
  d3.select('#gun_violence_button').on('click', function(d) {
        update_slider(shooting_data.gun_violence);
        display_map(shooting_data.gun_violence, 2013);
        formatLineData(shooting_data.gun_violence);
  });
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

function plot_parallel_coordinates(map_width, pc_width, height, pad) {
	d3.select('svg').append('g').attr('transform', 'translate('+map_width+pad+','+pad+')').attr('class', 'parallel_coordinates');
    var selected_atts = Object.keys(shooting_data);
    var timeOverlap = getTimeOverlap();

	// setup x_scale
	var x_scale = d3.scaleBand().domain(selected_atts).range([map_width, map_width + pc_width - pad]);
	// setup y_scales for each category
	var categories_y_scales = [];
	for (var i = 0; i < selected_atts.length; i++) {
        var min = Number.MAX_SAFE_INTEGER;
        var max = 0;
        for (var j = 0; j < timeOverlap.length; j++) {
            // Get all state shooting counts in a year and sum them up
            var all_state_yearly_shootings = Object.values(shooting_data[selected_atts[i]].yearly_shootings[timeOverlap[j]]);
            all_state_yearly_shootings.forEach(function(d) {
                // Compare to all other states' and years' shootings
                min = min < d ? min : d;
                max = max > d ? max : d;
            });
        }
		categories_y_scales.push(
			d3.scaleLinear().domain([max,min]).range([pad, height - pad])
		);
	}
    //
    // var pc_data = [];
    // for (var i = 0; i < timeOverlap.length; i++) {
    //     var temp_obj = {};
    //     temp_obj.year = timeOverlap[i];
    //     for (var j = 0; j < selected_atts.length; j++) {
    //         temp_obj[selected_atts[j]] = {};
    //         // console.log(shooting_data[selected_atts[j]].yearly_shootings[timeOverlap[i]]);
    //         for (var key in shooting_data[selected_atts[j]].yearly_shootings[timeOverlap[i]]) {
    //             temp_obj[selected_atts[j]][key] = shooting_data[selected_atts[j]].yearly_shootings[timeOverlap[i]][key]
    //         }
    //     }
    //     pc_data.push(temp_obj);
    // }

    var pc_data = [];
    for (var i = 0; i < timeOverlap.length; i++) {
        var temp_obj = {};
        temp_obj.year = timeOverlap[i];
        for (var state in shooting_data[selected_atts[0]].yearly_shootings[timeOverlap[i]]) {
            temp_obj[state] = {}
            for (var j = 0; j < selected_atts.length; j++) {
                temp_obj[state][selected_atts[j]] = shooting_data[selected_atts[j]].yearly_shootings[timeOverlap[i]][state]
            }
        }
        pc_data.push(temp_obj);
    }

    console.log(pc_data);
	setUpPCAxes(map_width, height, pad, x_scale, categories_y_scales);
	graphPC(pc_data, selected_atts, x_scale, categories_y_scales);
}

function setUpPCAxes(map_width, height, pad, x_scale, categories_y_scales) {
	var bandwidth = x_scale.bandwidth();
	// x-axis
	d3.select('svg').append('g')
		.attr('id', 'pc_bottomaxis')
		.attr('transform', 'translate('+ 0 +','+(height - pad)+')')
		.call(d3.axisBottom(x_scale).tickSize(0));

	d3.select('svg').append('g')
		.attr('id', 'pc_topaxis')
		.attr('transform', 'translate('+ 0 +','+(pad)+')')
		.call(d3.axisTop(x_scale).tickSize(0));

	// y-axes
	for (var i = 0; i < categories_y_scales.length; i++) {
		d3.select('svg').append('g')
			.attr('class', 'pc_leftaxis')
			.attr('transform', 'translate('+ ((map_width + bandwidth / 2) + (i * bandwidth))+','+0+')')
			.call(d3.axisLeft(categories_y_scales[i]));
	}
}
// plot the poly-lines
function graphPC(pc_data, selected_atts, x_scale, categories_y_scales) {
	var line = d3.line();

	var path = d3.select('svg').append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(pc_data)
    .enter();

    for (var state in pc_data[0]) {
        if (state !== "year") {
            path.append("path")
            .attr("class", 'pc_path')
        	.attr('key', d => d.year)
        	.attr('d', function(d) {
                console.log(d);
                var path_array = [];
                for (var type in d[state]) {
                    path_array.push([x_scale(type), categories_y_scales[selected_atts.indexOf(type)](d[state][type])]);
                }
                return line(path_array);
            })
            .attr('stroke', 'blue')
            .attr('fill', 'none')
            .attr('opacity', 0.25)
            .attr('transform', 'translate('+(x_scale.bandwidth() / 2)+','+0+')');
            }
        }
    }

function getTimeOverlap() {
    var range_mass = Object.keys(shooting_data.mass_shooting.yearly_shootings);
    var range_police = Object.keys(shooting_data.police_shooting.yearly_shootings);
    var range_gun = Object.keys(shooting_data.gun_violence.yearly_shootings);

    var filtered1 = range_mass.filter(value => -1 !== range_police.indexOf(value));
    var filtered2 = filtered1.filter(value => -1 !== range_gun.indexOf(value));
    // console.log(filtered2);

    return filtered2;
}

// TODO: implement function to show line plot details per state on hover
function formatLineData(dataset) {
    var line_data = {};
    // line_data contains fips code for each state and initialized value to empty object
    for (var state in state_to_fips) {
      line_data[state_to_fips[state]] = []
    }
    // console.log(line_data);

    var state_array = [];
    state_data = line_data;
    for (var year in dataset.yearly_shootings) {

      for (var id in dataset.yearly_shootings[year]) {
        state_data[id].push({
          year: parseInt(year),
          shootings: dataset.yearly_shootings[year][id]
        })
      }
    }
}

function show_line_graph(data) {
    var max_shootings = parseInt(d3.max(state_data[data.id], d => d.shootings));

    var min_year = parseInt(d3.min(state_data[data.id], d => d.year));
    var max_year = parseInt(d3.max(state_data[data.id], d => d.year));

    var x_scale = d3.scaleLinear()
          .domain([min_year, max_year])
          .range([1000, 1400]);

    var y_scale = d3.scaleLinear()
          .domain([0, max_shootings])
          .range([600, 400])
          .nice();

    var line_scale = d3.line()
        .x((d) => x_scale(d.year))
        .y((d) => y_scale(d.shootings));

    var axis_id = 'axis' + (data.id).toString();
    var label_id = 'label' + (data.id).toString();

    // x axis
    d3.select('svg').append('g')
        .attr('id', axis_id)
        .attr('transform', 'translate('+0+','+600+')')
        .call(d3.axisBottom(x_scale))
        // .call(d3.axisBottom(x_scale).tickFormat(d3.timeFormat('%Y')));
    d3.select('svg').append("text")
        .attr('id', label_id)
        .attr("transform", "translate(" + 1200 + " ," + 650 + ")")
        .style("text-anchor", "middle")
        .text("Year");

    // y axis
    d3.select('svg').append('g')
        .attr('id', axis_id)
        .attr('transform', 'translate('+1000+','+0+')')
        .call(d3.axisLeft(y_scale));
    d3.select('body').select('svg').append("text")
        .attr('id', label_id)
        .attr("transform", "rotate(-90)")
        .attr("y", 950)
        .attr("x", 0-530)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Shootings");

    var element_id = 'line' + (data.id).toString();
    d3.select('svg').selectAll(element_id).data([state_data])
      .enter().append('path')
      .attr('id', element_id)
      .attr('d', function(d) {
        // console.log(d[data.id]);
        return line_scale(d[data.id]);
      })
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('opacity', 1)
}

function hide_line_graph(data) {
    var element_id = '#line' + (data.id).toString();
    var axis_id = '#axis' + (data.id).toString();
    var label_id = '#label' + (data.id).toString();
    d3.select('svg').selectAll(element_id).attr('opacity', 0);
    d3.select('svg').selectAll(axis_id).remove();
    d3.select('svg').selectAll(label_id).remove();
}
