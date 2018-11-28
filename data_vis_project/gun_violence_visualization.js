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

var shooting_type = {
    "mass_shooting": 0,
    "police_shooting": 1
}

var current_data = shooting_type["mass_shooting"];

var shooting_data = {
    mass_shooting: {
    },
    police_shooting: {
    },
    gun_violence: {
    }
}

function graph_map(path_array) {
	var width = 960;
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
        add_slider(width, height, pad, shooting_data.mass_shooting.data);
    });
}

async function formatCSV(path) {
	var data = await d3.csv(path, function(d) {
		if (d.date) {
			// add year to data
			var year = d.date.split("/")[2];
			d.Year = year;

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

    // skim data from parsed shootings data file
    for (var i = 0; i < data_array.length; i++) {
        var shootings_count = {};
		var fips_array = Object.values(state_to_fips);
		fips_array.forEach(function(d) {
			shootings_count[d] = 0;
		});
		data_array[i].forEach(function(d) {
			shootings_count[d.fips] += 1;
		});

        if (i === 0) {
            shooting_data.mass_shooting.total_shootings = shootings_count;
        } else if (i == 1) {
            shooting_data.police_shooting.total_shootings = shootings_count;
        }
    }
}

// taken from the choropleth.js file from lecture in CS 3891 Data Visualization
function plot_it(width, height, datasets)  {
	var path = d3.geoPath();

	format = d3.format("")

	// initially display mass shootings data
	var shootings_values = Object.values(shooting_data.mass_shooting.total_shootings);
	var min = Math.min(...shootings_values);
	var max = Math.max(...shootings_values);

	color = d3.scaleQuantize()
	    .domain([min, max])
	    .range(d3.schemeBlues[9])

	var svg = d3.select('svg');

	var g = svg.append("g")
	  .attr("transform", "translate(0,40)");

	var x = d3.scaleLinear()
		.domain(d3.extent(color.domain()))
		.rangeRound([600, 860]);

	state_geometries = topojson.feature(us, us.objects.states).features
	svg.append("g")
		.selectAll("path")
		.data(state_geometries)
		.enter().append("path")
		  .attr("class", "state")
		  .attr("d", path)
	  	  .attr("fill", function(d) {
              return color(shooting_data.mass_shooting.total_shootings[d.id]);
	  	  })

	  //.datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
	// console.log(us.objects.states)
	svg.append("path")
	  .datum(topojson.mesh(us, us.objects.states))
	  .attr("fill", "none")
	  .attr("stroke", "black")
	  .attr("stroke-linejoin", "round")
	  .attr("d", path);

	// function for updating the data views
	function display_map(dataset_name) {
        var shootings_values = Object.values(shooting_data[dataset_name].total_shootings);
    	var min = Math.min(...shootings_values);
    	var max = Math.max(...shootings_values);

		color = d3.scaleQuantize()
		    .domain([min, max])
		    .range(d3.schemeBlues[9]);

		svg.selectAll('.state')
			  .attr("class", "state")
			  .attr("d", path)
		  	  .attr("fill", function(d) {
		  	  	return color(shooting_data[dataset_name].total_shootings[d.id]);
		  	  })
	}

	// button event handlers for switching data views
	d3.select('#mass_shooting_button').on('click', function(d) {
        update_slider();
		display_map("mass_shooting");
	});

	d3.select('#police_killings_button').on('click', function(d) {
        update_slider();
		display_map("police_shooting");
	});

	// d3.select('#gun_violence_button').on('click', function(d) {
	// 	display_map(shootings_dataset[3]);
	// });
}

// Draws a slider based on the data chosen.
// TODO: attach slider data, make time a scale of the time on the data.
function add_slider(width, height, pad, map_data){
	// console.log(map_data);
	var min_category_val = parseInt(d3.min(map_data, d => d.Year));
	var max_category_val = parseInt(d3.max(map_data, d => d.Year));

	var data3 = d3.range(0, max_category_val - min_category_val + 2).map(function (d) { return new Date(min_category_val + d, 0, 1);});
	// console.log(data3);

	var slider3 = d3.sliderHorizontal()
	  .min(d3.min(data3))
	  .max(d3.max(data3))
	  .step(1000 * 60 * 60 * 24 * 365)
	  .width(800)
	  .tickFormat(d3.timeFormat('%Y'));

  d3.select("svg")
    .append("g")
	.attr("id", "slider")
    .attr("transform", "translate(" + pad + "," + (600 + pad) + ")")
    .call(slider3);
}

function update_slider() {

}
