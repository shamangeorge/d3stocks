function quote_urlYQL(sym, domElm) {
    var symbol = sym;
    var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + symbol + '+%22)&env=store://datatables.org/alltableswithkeys&format=json'

    d3.json(url, function(error, data) {
        if (error) return error.message;
        var quote = data.query.results.quote;
        //console.log(quote.ErrorIndicationreturnedforsymbolchangedinvalid)
        if (quote.ErrorIndicationreturnedforsymbolchangedinvalid !== null) {
            console.warn(quote.ErrorIndicationreturnedforsymbolchangedinvalid);
        } else {
            visualizeMe(quote, domElm);
        }
    });

    function visualizeMe(quote, parent) {
        //parse the quote
        var domElm = document.createElement('section');
        domElm.id = 'quote_content';
        var quoteUI = buildQuoteUI(quote);
        var width = 300;
        var height = 200;
        var bounds = {
            xOff: 10,
            yOff: 10,
            width: width - 10,
            height: height - 10
        }
        var titleLeft = createDomElm({
            type: 'h3',
            text: quoteUI.symb,
            style: {
                position: 'absolute',
                top: bounds.yOff + 'px',
                left: bounds.xOff + 'px'
            }
        });

        var titleRight = createDomElm({
            type: 'h3',
            text: quoteUI.name,
            style: {
                position: 'absolute',
                top: bounds.yOff + 'px',
                right: bounds.xOff + 'px'
            }
        });
        var updateTimes = createDomElm({
            type: 'h4',
            text: quoteUI.cur_date + '<br>' + quoteUI.cur_time,
            style: {
                position: 'absolute',
                top: (bounds.yOff + 50) + 'px',
                right: bounds.xOff + 'px',
                textAlign: 'right'
            }
        });
        //choose color base on change
        var color = chooseColor(quoteUI.change[0]);

        var changes = createDomElm({
            type: 'h5',
            text: quoteUI.change + '<br>' + quoteUI.change_percentage,
            style: {
                // border: '2px solid ' + color,
                position: 'absolute',
                top: (bounds.yOff + 100) + 'px',
                right: bounds.xOff + 'px',
                textAlign: 'right',
                color: color
            }
        });
        var LTP = createDomElm({
            type: 'h3',
            text: quoteUI.ltp,
            style: {
                position: 'absolute',
                bottom: (2 * bounds.yOff) + 'px',
                left: bounds.xOff + 'px',
                textAlign: 'center',
                fontSize: '55px'
            }
        });
        var arrow = buildArrow(quoteUI.change[0], bounds)


        domElm.appendChild(titleLeft);
        domElm.appendChild(titleRight);
        domElm.appendChild(updateTimes);
        domElm.appendChild(changes);
        domElm.appendChild(LTP);
        domElm.appendChild(arrow);
        parent.appendChild(domElm);
        //var str = traverseObj(quoteUI);
        //console.log(quote)
        //console.log(str);
    }

    function traverseObj(quote) {
        var object = quote;
        var output = '<ul>';
        for (var property in object) {
            output += '<li>' + property + ': ' + object[property] + ';<li>';
        }
        output += '</ul>';
        return output;
    }

    function buildQuoteUI(quote) {
        return {
            name: quote.Name,
            symb: quote.symbol,
            ltp: quote.LastTradePriceOnly,
            change: quote.Change,
            change_percentage: quote.ChangeinPercent,
            cur_date: moment().format('MMMM Do YYYY'),
            cur_time: moment().format('h:mm:ss a')
        }
    }

    function createDomElm(params) {
        var elm = document.createElement(params.type);
        var innerText = params.text;
        var style = params.style;
        for (var property in style) {
            elm.style[property] = style[property];
        }
        elm.innerHTML = innerText;
        return elm;
    }

    function getSign(sign) {
        switch (sign) {
            case '+':
                {
                    return true;
                    break;
                }
            default:
                {
                    return false;
                    break;
                }
        }
    }

    function chooseColor(sign) {
        var color;
        if (getSign(sign)) {
            color = 'limegreen';
        } else {
            color = 'red';
        }
        return color;
    }


    function buildArrow(sign, bounds) {
        var color = chooseColor(sign);
        var arrow;
        if (getSign(sign)) {
            //up arrow
            arrow = createDomElm({
                type: 'div',
                text: '',
                style: {
                    position: 'absolute',
                    bottom: 10 + 'px',
                    left: 5 + 'px',
                    textAlign: 'center',
                    width: '0px',
                    height: '0px',
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderBottom: '15px solid ' + color,
                }
            });
        } else {
            //down arrow
            arrow = createDomElm({
                type: 'div',
                text: '',
                style: {
                    position: 'absolute',
                    bottom: 10 + 'px',
                    left: 5 + 'px',
                    textAlign: 'center',
                    width: '0px',
                    height: '0px',
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderTop: '15px solid ' + color
                }
            });
        }
        return arrow;
    }
}
