//////////////////////////////////////////
// convenience DOM manipulation Extensions
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function Stocks() {
    var MONTH = moment().month(),
        DAY = moment().day(),
        YEAR = moment().year() - 15;
    var spin = new Spinner({
        lines: 20, // The number of lines to draw
        length: 8, // The length of each line
        width: 2, // The line thickness
        radius: 0, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 2.2, // Rounds per second
        trail: 100, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    }).spin();
    var companies = ['AAPL', 'GOOG', 'FB'];
    var width = 500; //document.getElementsByTagName("body")[0].clientWidth * 0.6;
    var WW = document.getElementsByTagName("body")[0].clientWidth;
    var get_prices = historical_prices(MONTH, DAY, YEAR);
    var chart = stock_chart();
    chart = chart.width(width - chart.marginLeft() - chart.marginRight());
    var prices = [];
    var slider = document.getElementById('slider');
    slider.addEventListener("input", function(evt) {
        YEAR = this.value;
        console.log(YEAR)
        if (YEAR === '2014') {
            MONTH = moment().month() - 1;
        }
        get_prices = null;
        get_prices = historical_prices(MONTH, DAY, YEAR);
        prices.length = 0;
        prices = [];
        d3.select("#chart").datum(prices).call(chart);

        updateCompanies({
            append: false,
        });
    }, false);

    d3.select("#chart").datum(prices).call(chart);
    d3.select("#refresh").on('click', function(evt) {
        clearNodes();
        updateCompanies({
            append: true,
        });
    });
    d3.select(".add")
        .on("click", function(evt) {
            var input = d3.select("#new_company")[0][0];
            if (input.value !== '' && input.value !== 'undefined' && input.value !== null && companies.indexOf(input.value.toUpperCase()) === -1) {
                companies.push(input.value);

                updateCompanies({
                    append: false,
                    company: input.value
                });
                input.value = "";
            }
        });

    updateCompanies({
        append: true
    });

    d3.select(window).on("resize", _.debounce(function(d, i) {

        var width = 500; //document.getElementsByTagName("body")[0].clientWidth * 0.6;
        var newUIwidth = document.getElementsByTagName("body")[0].clientWidth;
        chart = chart.width(width - chart.marginLeft() - chart.marginRight());
        d3.select("#chart")
            .datum(prices)
            .call(chart);
        var e = d3.selectAll('.quote_profile')[0];
        for (var i = 0; i < e.length; i++) {
            e[i].style.left = '0px';
            if (WW - newUIwidth > 0) {
                move(e[i], linear_inv, 1000, Math.abs(WW - newUIwidth));
            } else {
                move(e[i], linear, 1000, Math.abs(WW - newUIwidth));
            }
            //e[i].style.marginRight = 'auto';
        }
        WW = newUIwidth;
    }, 500));

    function updateCompanies(params) {
        var companyEnter = d3.selectAll("#companies")
            .selectAll(".company")
            .data(companies);

        companyEnter.enter()
            .append("span")
            .attr("class", "company")
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(4000)
                    .attr("class", "company remove");
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("class", "company");
            })
            .on("click", function(d, i) {
                companies.remove(i);
                prices = _.filter(prices, function(p) {
                    return p.name != d;
                });
                removeNode(d);
                updateCompanies({
                    append: false
                });
            });

        companyEnter
            .style("background-color", function(d) {
                return chart.color(d);
            })
            .text(function(d) {
                return d;
            });

        companyEnter.exit()
            .transition()
            .duration(100)
            .remove();

        companies.forEach(function(company) {
            setTimeout(function() {
                document.getElementById("spin").appendChild(spin.el);

                get_prices(company, function(data) {
                    data_hash = {
                        name: company,
                        values: data.map(function(d) {
                            return {
                                close: parseFloat(d.close),
                                date: d3.time.format("%Y-%m-%d").parse(d.date)
                            };
                        })
                    };

                    prices.push(data_hash);
                    d3.select("#chart")
                        .datum(prices)
                        .call(chart);
                    d3.select("#spin")[0][0].innerHTML = "";
                });
                if (params.append) {
                    var d = document.createElement('section');
                    d.className = 'quote_profile';
                    d.id = company;
                    //d.style.marginLeft = '-500px';
                    move(d, bounceEaseOut, 3000, window.innerWidth - 300);
                    d.addEventListener('click', function() {
                        removeNode(d.id);
                    })
                    document.getElementById('quotes').appendChild(d);
                    quote_urlYQL(company, d);
                }
                if (params.company === company) {

                    var d = document.createElement('section');
                    d.className = 'quote_profile';
                    d.id = company;
                    //d.style.marginLeft = '-500px';
                    move(d, bounceEaseOut, 3000, window.innerWidth - 300);
                    d.addEventListener('click', function() {
                        move(d, linear_inv, 2000, window.innerWidth, id);
                        this.removeEventListener('click')
                    })
                    document.getElementById('quotes').appendChild(d);
                    quote_urlYQL(company, d);
                }
            }, 1000);
        });
    }

    function removeNode(id) {
        // clear the nodes
        var d = document.getElementById(id);
        move(d, linear_inv, 2000, window.innerWidth, id);
    }

    function clearNodes() {
        // clear the nodes
        var qUI = document.getElementById('quotes');
        while (qUI.firstChild) {
            qUI.removeChild(qUI.firstChild);
        }
    }
}
