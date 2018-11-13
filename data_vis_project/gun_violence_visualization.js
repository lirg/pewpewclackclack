// taken from the choropleth.js file from lecture in CS 3891 Data Visualization

function plot_it()  {
	var width = 960;
	var height = 600;
	var path = d3.geoPath();

	color = d3.scaleQuantize()
      .domain([1, 10])
      .range(d3.schemeBlues[9])

	format = d3.format("")

	var x = d3.scaleLinear()
	  .domain(d3.extent(color.domain()))
	  .rangeRound([600, 860]);

	var svg = d3.select('body').append('svg').attr('width', width).attr('height', height)

	var g = svg.append("g")
	  .attr("transform", "translate(0,40)");

	var show_choropleth = false;
	if(show_choropleth)  {
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

	county_geometries = topojson.feature(us, us.objects.counties).features
	svg.append("g")
		.selectAll("path")
		.data(county_geometries)
		.enter().append("path")
		  .attr("class", "county")
		  .attr("d", path)
		  .attr("fill", 'none')

	  //.datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
	console.log(us.objects.states)
	svg.append("path")
	  .datum(topojson.mesh(us, us.objects.states))
	  .attr("fill", "none")
	  .attr("stroke", "black")
	  .attr("stroke-linejoin", "round")
	  .attr("d", path);
}
