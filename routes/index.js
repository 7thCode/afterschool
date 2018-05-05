var express = require('express');
var router = express.Router();

var coinexchange = require('request');

/* GET home page. */
router.get('/', function(from_browser, to_browser, next) {
    to_browser.render('index', {title:"aaaaaa"});
});


/* GET home page. */
router.get('/getmarkets', function(from_browser, to_browser, next) {
    try {

        var coinexchange_options = {
            url: 'https://www.coinexchange.io/api/v1/getmarkets',
            json: true
        };

        coinexchange.get(coinexchange_options, function (error_from_coinexchange, response_from_coinexchange, body) {
            if (!error_from_coinexchange && response_from_coinexchange.statusCode == 200) {
                to_browser.send(JSON.stringify(body));
            } else {
                console.log('error: '+ response_from_coinexchange.statusCode);
            }
        });
    } catch (e) {
        next();
    }
});

/* GET home page. */
router.get('/getmarketsummaries', function(from_browser, to_browser, next) {

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getmarketsummaries',
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.send(JSON.stringify(body));

    });

});

/* GET home page. */
router.get('/getmarketsummary/:id', function(from_browser, to_browser, next) {

    var id = from_browser.params.id;

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getmarketsummary?market_id=' + id,
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.send(JSON.stringify(body));

    });

});

/* GET home page. */
router.get('/getorderbook/:id', function(from_browser, to_browser, next) {

    var id = from_browser.params.id;

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getorderbook?market_id=' + id,
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.send(JSON.stringify(body));

    });

});

/* GET home page. */
router.get('/getcurrencies', function(from_browser, to_browser, next) {

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getcurrencies',
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.send(JSON.stringify(body));

    });

});

/* GET home page. */
router.get('/getcurrency/:id', function(from_browser, to_browser, next) {

    var id = from_browser.params.id;

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getcurrency?currency_id=' + id,
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.send(JSON.stringify(body));

    });

});

module.exports = router;
