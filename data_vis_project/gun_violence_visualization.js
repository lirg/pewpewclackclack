function graph_map(path) {
	var width = 960;
	var height = 1000;
	var pad = 30
	d3.select('body').append('svg').attr('width', width).attr('height', height)

	d3.csv(path).then(function(data)  {
	  map_data = data;
	  plot_it(width, height, map_data);
	  add_slider(width, height, pad);
	})
}

// taken from the choropleth.js file from lecture in CS 3891 Data Visualization
function plot_it(width, height, mass_shooting_data)  {
	var path = d3.geoPath();

	color = d3.scaleQuantize()
      .domain([0, 40])
      .range(d3.schemeBlues[9])

	format = d3.format("")

	var mass_shootings_count = {};
	mass_shooting_data.forEach(function(d) {
		if (mass_shootings_count[d.State]) {
			mass_shootings_count[d.State] += 1;
		} else {
			mass_shootings_count[d.State] = 1;
		}
	});

	console.log(mass_shootings_count);

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

<<<<<<< HEAD
	state_geometries = topojson.feature(us, us.objects.states).features
	console.log(state_geometries);
=======
	county_geometries = topojson.feature(us, us.objects.counties).features
>>>>>>> 3631b9628e678758f3df05826aed43044f814642
	svg.append("g")
		.selectAll("path")
		.data(county_geometries)
		.enter().append("path")
		  .attr("class", "county")
		  .attr("d", path)
<<<<<<< HEAD
	  	  // .attr("fill", function(d) { 
	  	  // 	// console.log(d);
	  	  // 	// console.log(mass_shootings_count[d.State]);
	  	  // 	return color(mass_shootings_count[d.State]);
	  	  // } 
	  	  // )
=======
		  .attr("fill", 'none')
>>>>>>> 3631b9628e678758f3df05826aed43044f814642

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
function add_slider(width, height, pad){
	var slider = d3.sliderHorizontal()
    .min(0)
    .max(10)
    .step(1)
    .width(300)
    .displayValue(false)
    .on('onchange', val => {
      d3.select("#value").text(val);
    });

  d3.select("svg")
    .append("g")
	.attr("id", "slider")
    .attr("transform", "translate(" + width / 2 + "," + (600 + pad) + ")")
    .call(slider);
}
