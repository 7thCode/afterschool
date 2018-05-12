var express = require('express');
var router = express.Router();

var coinexchange = require('request');

/* GET home page. */
router.get('/', function (from_browser, to_browser, next) {
    to_browser.render('index', {title: "aaaaaa"});
});


/* get markets. */
router.get('/getmarkets', function (from_browser, to_browser, next) {
    try {

        var coinexchange_options = {
            url: 'https://www.coinexchange.io/api/v1/getmarkets',
            json: true
        };

        coinexchange.get(coinexchange_options, function (error_from_coinexchange, response_from_coinexchange, body) {
            if (!error_from_coinexchange && response_from_coinexchange.statusCode == 200) {
                to_browser.send(JSON.stringify(body));
            } else {
                console.log('error: ' + response_from_coinexchange.statusCode);
            }
        });
    } catch (e) {
        next();
    }
});



var model = require('./model');

router.get('/createmarkets', function (from_browser, to_browser, next) {

    var Market = model.Market;

    var coinexchange_options = {
        url: 'https://www.coinexchange.io/api/v1/getmarkets',
        json: true
    };

    coinexchange.get(coinexchange_options, function (error_from_coinexchange, response_from_coinexchange, body) {
        body.result.forEach(function (market) {

            var new_market = new Market({
                MarketID: market.MarketID,
                MarketAssetName: market.MarketAssetName,
                MarketAssetCode: market.MarketAssetCode,
                MarketAssetID: market.MarketAssetID,
                MarketAssetType: market.MarketAssetType,
                BaseCurrency: market.BaseCurrency,
                BaseCurrencyCode: market.BaseCurrencyCode,
                BaseCurrencyID: market.BaseCurrencyID,
                Active: market.Active
            });

            new_market.save(function (error) {
                if (!error) {
                }
            });

        });
        to_browser.send("ok");
    });

});

router.get('/querymarkets', function (from_browser, to_browser, next) {

    var Market = model.Market;

    Market.find(from_browser.query, function(err, result) {
        to_browser.render('getmarkets', {result:result});
    });

});



/* get market summaries. */
router.get('/getmarketsummaries', function (from_browser, to_browser, next) {

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getmarketsummaries',
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.send(JSON.stringify(body));

    });

});


/* get market summary. */
router.get('/getmarketsummary/:id', function (from_browser, to_browser, next) {

    var id = from_browser.params.id;

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getmarketsummary?market_id=' + id,
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.send(JSON.stringify(body));

    });

});

/* get order book. */
router.get('/getorderbook/:id', function (from_browser, to_browser, next) {

    var id = from_browser.params.id;

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getorderbook?market_id=' + id,
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.send(JSON.stringify(body));

    });

});

/* create order book. */



router.get('/createorderbook/:id', function (from_browser, to_browser, next) {

    var Book = model.Book;

    var id = from_browser.params.id;

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getorderbook?market_id=' + id,
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        var new_book = new Book({
            SellOrders: body.result.SellOrders,
            BuyOrders: body.result.BuyOrders
        });

        new_book.save(function (error) {
            if (!error) {
                to_browser.send("ok");
            }
        });

    });

});

router.get('/queryorderbook', function (from_browser, to_browser, next) {

    var Book = model.Book;

    Book.find(from_browser.query, function(err, result) {
        to_browser.render('getorderbook', {result:result[0]});
    });

});



/* get currencies. */
router.get('/getcurrencies', function (from_browser, to_browser, next) {

    var options = {
        url: 'https://www.coinexchange.io/api/v1/getcurrencies',
        json: true
    };

    coinexchange.get(options, function (error_from_coinexchange, response_from_coinexchange, body) {

        to_browser.send(JSON.stringify(body));

    });

});

/* get currency. */
router.get('/getcurrency/:id', function (from_browser, to_browser, next) {

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
