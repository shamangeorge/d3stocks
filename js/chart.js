function stock_chart() {
    var margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 40
    };
    var width = 1400 - margin.right - margin.left,
        height = 300 - margin.top - margin.bottom,
        duration = 500,
        x = d3.time.scale(),
        y = d3.scale.linear(),
        xAxis = d3.svg.axis().orient("bottom"),
        yAxis = d3.svg.axis().orient("left"),
        line = d3.svg.line().interpolate("basis").x(x_accessor).y(y_accessor),
        color = d3.scale.category10(),
        svg,
        data_points;

    function chart(selection) {
        selection.forEach(function(e) {
            data_points = d3.selectAll(e).datum();
            var keys = data_points.map(function(d) {
                return d.name
            });

            color.domain(keys);


            x.range([0, width])
                .domain([
                    d3.min(data_points, function(c) {
                        return d3.min(c.values, function(d) {
                            return d.date;
                        });
                    }),
                    d3.max(data_points, function(c) {
                        return d3.max(c.values, function(d) {
                            return d.date;
                        });
                    })
                ]);

            y.range([height, 0])
                .domain([
                    d3.min(data_points, function(c) {
                        return d3.min(c.values, function(d) {
                            return d.close;
                        });
                    }),
                    d3.max(data_points, function(c) {
                        return d3.max(c.values, function(d) {
                            return d.close;
                        });
                    })
                ]);

            xAxis.scale(x);
            yAxis.scale(y);



            svg = d3.selectAll(e).selectAll("svg > g");

            if (svg[0][0] == null) {
                svg = d3.selectAll(e).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")");
                svg.append("g")
                    .attr("class", "y axis")
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Closing Price");
            } else {
                d3.selectAll(e)
                    .selectAll("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .selectAll("svg > g")
                    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
            }

            svg.selectAll(".x.axis")
                .transition()
                .duration(duration)
                .call(xAxis);

            svg.selectAll(".y.axis")
                .transition()
                .duration(duration)
                .call(yAxis);

            var lines = svg.selectAll(".line-wrap")
                .data(data_points, function(d) {
                    return d.name;
                });

            var linesEnter = lines.enter().append("g")
                .attr("class", "line-wrap");

            linesEnter.append("path")
                .attr("class", "line");

            lines.selectAll(".line")
                .transition()
                .duration(duration)
                .attr("d", function(d) {
                    return line(d.values);
                })
                .style("stroke", function(d) {
                    return color(d.name);
                });

            linesEnter.append("text")
                .attr("x", 3)
                .attr("dy", ".35em");
            lines.selectAll("text")
                .attr("transform", function(d) {
                    return "translate(" + x(d.values[0].date) + "," + y(d.values[0].close) + ")";
                })
                .style("fill", function(d) {
                    return color(d.name);
                })
                .text(function(d) {
                    return d.name
                });

            lines.exit().remove();
        });
    }


    function x_accessor(d) {
        return x(d.date);
    }

    function y_accessor(d) {
        return y(d.close);
    }

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    }

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    }

    chart.marginLeft = function(_) {
        if (!arguments.length) return margin.left;
        margin.left = _;
        return chart;
    }

    chart.marginRight = function(_) {
        if (!arguments.length) return margin.right;
        margin.right = _;
        return chart;
    }

    chart.marginTop = function(_) {
        if (!arguments.length) return margin.top;
        margin.top = _;
        return chart;
    }

    chart.marginBottom = function(_) {
        if (!arguments.length) return margin.bottom;
        margin.bottom = _;
        return chart;
    }


    chart.color = function() {
        return color;
    }
    return chart;
}
