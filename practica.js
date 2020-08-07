d3.json("practica_airbnb.json")
    .then((mapa) => {
        drawMap(mapa);
        drawBarChart(mapa);
    });

function drawMap(mapa) {
    console.log(mapa)
    console.log(mapa.features)

    var propertyName = mapa.features;
    propertyName.forEach(function(data) {
        
        if (typeof data.properties.avgprice === "undefined") {
            data.properties.avgprice = 1
        }
        console.log(data.properties.name, data.properties.avgprice);
    });

    for (var i=0, len=mapa.length;i < len; i++) {
        console.log(mapa.properties[i])
    }
    var width = 800;
    var height = 800;

    var svg = d3.select("div")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");

    //var centrar = d3.geoCentroid(mapa)

    var project = d3.geoMercator()
                    .fitSize([width,height], mapa)

    var pathGenerator = d3.geoPath().projection(project)

    /*var media =  (propertyName.forEach(function(data){
        if (typeof data.properties.avgprice === "undefined") {
            data.properties.avgprice = 14
        }
        if (data.properties.avgprice === 280) {
            data.properties.avgprice = 151
        }
        let media = data.properties.avgprice
        console.log(media)
    }));*/

    var color = d3.scaleQuantize()
                    .domain([0, 280])
                    .range(d3.schemePaired)

    

    var pathMadrid = svg.append("g")
                        .selectAll("path")
                        .data(mapa.features)
                        .enter()
                        .append("path")
                        .attr("d", (d) => pathGenerator(d))
                        .attr("fill", (d, i) => color(i));

                        console.log(pathMadrid)

    var numeroLeyenda =  6;
    var widthRectangle = (width / numeroLeyenda) -2;
    var heightRectangle = 12;

    var scaleLegend = d3.scaleLinear()
                        .domain([0, numeroLeyenda])
                        .range([0, width]);

    var rectLegend = svg.append("g")
        .selectAll("rect")
        .data(d3.schemePaired)
        .enter()
        .append("rect")
        .attr("x", (d, i) => scaleLegend(i))
        .attr("width", widthRectangle / 2)
        .attr("height", heightRectangle)
        .attr("fill", (d) => d);

    svg.append("g")
        .selectAll("text")
        .data(d3.schemePaired)
        .enter()
        .append("text")
        .attr("x", (d, i) => scaleLegend(i))
        .attr("y", heightRectangle * 2)
        .text();
    
    
}

function drawBarChart (mapa) {
    var height = 800;
    var width = 800;
    var marginbottom = 100;
    var margintop = 50;
    var valor = mapa.features[17].properties.avgbedrooms
    var nombre = mapa.features[17].properties.name
    console.log(valor)
    var ymin = d3.min(valor.map(function(d) {
        return d.total
    }));
    var ymax = d3.max(valor.map(function(d) {
        return d.total
    }));
    console.log(ymin, ymax)
    var xmin = d3.min(valor.map(function(d) {
        return d.bedrooms
    }));
    var xmax = d3.max(valor.map(function(d) {
        return d.bedrooms
    }));
    console.log(xmin, xmax)

    console.log(valor.map(function(d){
        return d.total
    }));
    console.log(mapa.features[17].properties.avgbedrooms.bedrooms)

    var svg = d3.select('#dos')
                .append("svg")
                .attr("width", width)
                .attr("height", height + marginbottom + margintop)
                .append("g")
                .attr("transform", "translate(50, 50)");

    var scaleX = d3.scaleBand()
                    .domain(valor.map(function(d) {
                        return d.bedrooms
                    }))
                    .range([0, width /1.3])
                    .padding(0.5);

    var scaleY = d3.scaleLinear()
                    .domain([0, ymax])
                    .range([height / 2, 0]);

    var xaxis = d3.axisBottom(scaleX);
    var yaxis = d3.axisLeft(scaleY);

    svg.append("g").attr("transform", "translate(0," + height / 2 + ")").call(xaxis)
    svg.append("g").call(yaxis)

    svg.append("g")
        .selectAll("rect")
        .data(valor)
        .enter()
        .append("rect")
        .attr("x", (d) => scaleX(d.bedrooms))
        .attr("y", (d) => scaleY(d.total))
        .attr("width", scaleX.bandwidth())
        .attr("height", function(d) {
            return height / 2 - scaleY(d.total) 
        })
        .attr("fill", "orange")

    svg.append("g")
        .selectAll("text")
        .data(nombre)
        .enter()
        .append("text")
        .attr("x", 350)
        .attr("y", -10)
        .text("Barrio: " + nombre)

    svg.append("g")
        .selectAll("text")
        .data(nombre)
        .enter()
        .append("text")
        .attr("x", -300)
        .attr("y", -30)
        .text("Número de propiedades")
        .attr("transform", "rotate(-90)")

    svg.append("g")
        .selectAll("text")
        .data(nombre)
        .enter()
        .append("text")
        .attr("x", 250)
        .attr("y", 430)
        .text("Número de habitaciones")


}