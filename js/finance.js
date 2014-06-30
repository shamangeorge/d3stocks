var yql_url = "http://query.yahooapis.com/v1/public/yql?q=";
var base_finance_url = "http://ichart.finance.yahoo.com/table.csv?"; // s = YHOO&d = 0&e = 28&f = 2010&g = d&a = 3&b = 12&c = 1996&ignore = .csv";

function historical_prices(month, day, year) {
    var symbol = 'AAPL',
        from_date = {
            month: month,
            day: day,
            year: year
        }, to_date = {
            month: moment().month(),
            day: moment().day(),
            year: moment().year()
        };

    var query_map = {
        from: {
            month: 'a',
            day: 'b',
            year: 'c'
        },
        to: {
            month: 'd',
            day: 'e',
            year: 'f'
        }
    };

    function finance_url() {
        var dates = [from_date, to_date];
        var opts = {};
        dates.forEach(function(date, i) {
            var date_key = ["from", "to"][i];
            d3.keys(date).forEach(function(key) {
                var query_key = query_map[date_key][key];
                opts[query_key] = date[key];
            });
        });

        opts['s'] = symbol;
        opts['g'] = 'd';
        opts['ignore'] = '.csv';

        var query = _.map(opts, function(v, k) {
            return k + "=" + v;
        }).join("&");

        return base_finance_url + query;
    }

    function pricing(sym, callback) {
        symbol = sym;
        var query_str = "select%20*%20from%20html%20where%20url%3D'" + encodeURIComponent(finance_url()) + "'&format=json";
        var url = yql_url + query_str;

        d3.json(url, function(error, data) {
            if (!data) return callback(data);
            if (data.query.results) {
                var csv_text = data.query.results.body.p;

                var clean_csv_text = csv_text.slice(0, 42).trim().toLowerCase() + "\n"; // column names row
                csv_text.slice(42).split(" ").forEach(function(line) {
                    clean_csv_text += line + "\n";
                });

                callback(d3.csv.parse(clean_csv_text));
            }
        });
    }

    return pricing;
}
