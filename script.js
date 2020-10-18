var coffee;
let type = d3.select('#group-by').node().value
let state = 1
var margin = {top: 50, right: 50, bottom: 50, left: 50};
var width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom

const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1)

const yScale = d3.scaleLinear()
    .range([height, 0])

const xAxis = d3.axisBottom()
    .scale(xScale)

const yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5, "s")
  
svg.append("g")
	.attr("class", "axis x-axis")
	.call(xAxis)
    .attr("transform", `translate(0, ${height})`);
   
svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

svg.append("text") 
    .attr("id", "axislbl")
    .attr('x', 0)
    .attr('y', -10)

function update(data,type){
  
  xScale.domain(data.map(d=>d.company))
  yScale.domain([0, d3.max(data, function(d) {return +d[type]})]);
  
  svg.selectAll("rect")
    .transition()
    .duration(1500)
    .attr('fill', '#800020')
    .attr('opacity', 0.0)
    .remove()


  const bars = svg.selectAll('.bar').data(data, d=>d[type]);
  
  bars.enter().data(data, d=>d.company).append("rect")
    .attr('x', d=>xScale(d.company))
    .attr('y', height)
    .attr('fill', 'yellow')
    .attr('opacity', 0.5)
    .merge(bars)
    .transition()
    .delay(function(d, i) { return i * 100; })
    .duration(2000)
    .attr('fill', 'black')
    .attr('x', d=>xScale(d.company))
    .attr('y', d=>(yScale(d[type])))
    .attr('width', xScale.bandwidth())
    .attr('height', d=>(height - yScale(d[type])))
    .attr('opacity', 1)

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale);   
    
    svg.select(".y-axis")
        .transition()
        .duration(500)   
        .call(yAxis)

    svg.select(".x-axis")
        .attr("class", "axis x-axis")
        .transition()
        .duration(2500)
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);

    svg.select("#axislbl")
        .text(type)
    
}

d3.csv('https://cdn.glitch.com/3856cfa1-2322-451b-b364-84804950ce48%2Fcoffee-house-chains.csv?v=1602983813200', d3.autoType).then(data=>{update(data, type)});

d3.select('#group-by').on('change', (event)=>{
    type = d3.select('#group-by').node().value
    d3.csv('https://cdn.glitch.com/3856cfa1-2322-451b-b364-84804950ce48%2Fcoffee-house-chains.csv?v=1602983813200', d3.autoType).then(data=>{update(data,type)});
})

d3.select('#sort').on('click', (event)=>{
    type = d3.select('#group-by').node().value
    d3.csv('https://cdn.glitch.com/3856cfa1-2322-451b-b364-84804950ce48%2Fcoffee-house-chains.csv?v=1602983813200', d3.autoType).then(data=>{
        coffee = data;
        if (state == 1){
            coffee.sort(function(a,b){return b[type] - a[type]});
            state = 0
        }
        else{
            coffee.sort(function(a,b){return a[type] - b[type]});
            state = 1
        }
        update(coffee, type);
})})