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

function graph_map(path) {
	var width = 960;
	var height = 1000;
	var pad = 30
	d3.select('body').append('svg').attr('width', width).attr('height', height)

	// TODO: Reprocesses data if we switch between datasets. Should keep old data in the future.
	if (path === '/data/stanford-msa-2017/mass_shooting_events_stanford_msa_release_06142016_plus2017.csv') {
		d3.csv(path, function(d) {
			// add year to data
			var year = d.Date.split("/")[2];
			d.Year = year;
			// add fips id to data
			d.fips = state_to_fips[d.State];
			return d;
		}).then(function(data)  {
		  map_data = data;
		  plot_it(width, height, map_data);
		  add_slider(width, height, pad, map_data);
		})
	}
}

// taken from the choropleth.js file from lecture in CS 3891 Data Visualization
function plot_it(width, height, mass_shooting_data)  {
	var path = d3.geoPath();

	color = d3.scaleQuantize()
      .domain([0, 40])
      .range(d3.schemeBlues[9])

	format = d3.format("")

	// skim data from parsed mass shootings data file
	var mass_shootings_count = {};
	var fips_array = Object.values(state_to_fips);
	fips_array.forEach(function(d) {
		mass_shootings_count[d] = 0;
	});
	mass_shooting_data.forEach(function(d) {
		mass_shootings_count[d.fips] += 1;
	});
	// console.log(mass_shootings_count);

	var x = d3.scaleLinear()
	  .domain(d3.extent(color.domain()))
	  .rangeRound([600, 860]);

	var svg = d3.select('svg');

	var g = svg.append("g")
	  .attr("transform", "translate(0,40)");

	var show_legend = false;
	if(show_legend)  {
		g.selectAll("rect")
			.data(color.range().map(d => color.invertExtent(d)))
			.enter().append("rect")
			  .attr("height", 8)
			  .attr("x", d => x(d[0]))
			  .attr("width", d => x(d[1]) - x(d[0]))
			  .attr("fill", d => color(d[0]));

		g.append("text")
		  .attr("class", "caption")
		  .attr("x", x.range()[0])
		  .attr("y", -6)
		  .attr("fill", "#000")
		  .attr("text-anchor", "start")
		  .attr("font-weight", "bold")

		g.call(d3.axisBottom(x)
		  .tickSize(13)
		  .tickFormat(format)
		  .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))
		.select(".domain")
		  .remove();
	}

	state_geometries = topojson.feature(us, us.objects.states).features
	svg.append("g")
		.selectAll("path")
		.data(state_geometries)
		.enter().append("path")
		  .attr("class", "state")
		  .attr("d", path)
		  .attr('fill', 'none')
	  	  .attr("fill", function(d) {
	  	  	// console.log(d);
	  	  	// console.log(mass_shootings_count[d.id]);
	  	  	return color(mass_shootings_count[d.id]);
	  	  }
	  	  )

	  //.datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
	console.log(us.objects.states)
	svg.append("path")
	  .datum(topojson.mesh(us, us.objects.states))
	  .attr("fill", "none")
	  .attr("stroke", "black")
	  .attr("stroke-linejoin", "round")
	  .attr("d", path);
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
