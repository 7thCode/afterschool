var express = require('express');
var router = express.Router();

var coinexchange = require('request');

/* GET home page. */
router.get('/getmarkets', function(from_browser, to_browser, next) {

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getmarkets',
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.render('getmarkets', body);

    });

});

/* GET home page. */
router.get('/getmarketsummaries', function(from_browser, to_browser, next) {

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getmarketsummaries',
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.render('getmarketsummaries', body);

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

        to_browser.render('getmarketsummary', body);

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

        to_browser.render('getorderbook', body);

    });

});

/* GET home page. */
router.get('/getcurrencies', function(from_browser, to_browser, next) {

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getcurrencies',
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.render('getcurrencies', body);

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

        to_browser.render('getcurrency', body);

    });

});



module.exports = router;
