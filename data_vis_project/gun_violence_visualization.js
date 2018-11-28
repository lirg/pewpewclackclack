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

<<<<<<< HEAD
=======
var abbrev_to_fips = {
   "AL"                 :  "01",
   "AK"                 :  "02",
   "AZ"                 :  "04",
   "AR"                 :  "05",
   "CA"                 :  "06",
   "CO"                 :  "08",
   "CT"                 :  "09",
   "DE"                 :  "10",
   "DC"                 :  "11",
   "FL"                 :  "12",
   "GA"                 :  "13",
   "HI"                 :  "15",
   "ID"                 :  "16",
   "IL"                 :  "17",
   "IN"                 :  "18",
   "IA"                 :  "19",
   "KS"                 :  "20",
   "KY"                 :  "21",
   "LA"                 :  "22",
   "ME"                 :  "23",
   "MD"                 :  "24",
   "MA"                 :  "25",
   "MI"                 :  "26",
   "MN"                 :  "27",
   "MS"                 :  "28",
   "MO"                 :  "29",
   "MT"                 :  "30",
   "NE"                 :  "31",
   "NV"                 :  "32",
   "NH"                 :  "33",
   "NJ"                 :  "34",
   "NM"                 :  "35",
   "NY"                 :  "36",
   "NC"                 :  "37",
   "ND"                 :  "38",
   "OH"                 :  "39",
   "OK"                 :  "40",
   "OR"                 :  "41",
   "PA"                 :  "42",
   "RI"                 :  "44",
   "SC"                 :  "45",
   "SD"                 :  "46",
   "TN"                 :  "47",
   "TX"                 :  "48",
   "UT"                 :  "49",
   "VT"                 :  "50",
   "VA"                 :  "51",
   "WA"                 :  "53",
   "WV"                 :  "54",
   "WI"                 :  "55",
   "WY"                 :  "56"
}

>>>>>>> c120175c441ac59a42c9e37fd65bad1d2d024c15
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

function graph_map(path_array) {
	var width = 960;
	var height = 1000;
	var pad = 30
	d3.select('body').append('svg').attr('width', width).attr('height', height)

	// TODO: Reprocesses data if we switch between datasets. Should keep old data in the future.
	var data_array = [];
	path_array.forEach(function(path) {
		d3.csv(path, function(d) {
			// console.log(d.date);
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
		}).then(function(data)  {
			// console.log(data);
	    	data_array.push(data);
	    	return data;
		}).then(function(data) {
			console.log(data_array);
			plot_it(width, height, data_array);
			add_slider(width, height, pad, data_array);
		})
	});
	console.log(data_array);
}

// taken from the choropleth.js file from lecture in CS 3891 Data Visualization
function plot_it(width, height, datasets)  {
	var path = d3.geoPath();

	format = d3.format("")

	// skim data from parsed shootings data file
	var shootings_dataset = [];
	datasets.forEach(function(data) {
		var shootings_count = {};
		var fips_array = Object.values(state_to_fips);
		fips_array.forEach(function(d) {
			shootings_count[d] = 0;
		});

		data.forEach(function(d) {
			shootings_count[d.fips] += 1;
		});

		shootings_dataset.push(shootings_count);

	})
	console.log(shootings_dataset);

	// initially display mass shootings data
	var dataset_array = Object.values(shootings_dataset[0]);
	var min = Math.min(...dataset_array);
	var max = Math.max(...dataset_array);

	var svg = d3.select('svg');

	var g = svg.append("g")
	  .attr("transform", "translate(0,40)");

	function display_map(data, min, max) {
		color = d3.scaleQuantize()
	      .domain([min, max])
	      .range(d3.schemeBlues[9])

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
			  .attr('fill', 'none')
		  	  .attr("fill", function(d) {
		  	  	return color(data[d.id]);
		  	  })

		  //.datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
		console.log(us.objects.states)
		svg.append("path")
		  .datum(topojson.mesh(us, us.objects.states))
		  .attr("fill", "none")
		  .attr("stroke", "black")
		  .attr("stroke-linejoin", "round")
		  .attr("d", path);
	}
	display_map(shootings_dataset[0], min, max);

	// button event handlers for switching data views
	d3.select('#mass_shooting_button').on('click', function(d) {
		var dataset_array = Object.values(shootings_dataset[0]);
		var min = Math.min(...dataset_array);
		var max = Math.max(...dataset_array);
		display_map(shootings_dataset[0], min, max);
	});

	d3.select('#police_killings_button').on('click', function(d) {
		var dataset_array = Object.values(shootings_dataset[1]);
		var min = Math.min(...dataset_array);
		var max = Math.max(...dataset_array);		
		display_map(shootings_dataset[1], min, max);
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
	console.log(data3);

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
