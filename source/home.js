/**
 * Created by Dvoiak on 22.12.2014.
 */
var async = require('async');
var logger = require('./utils/logger');
var PAYPAL_BUSINESS = process.env.PAYPAL_BUSINESS|| 'fdgfdghfd@dsvfsd.com';
var PAYPAL_ENDPOINT = process.env.PAYPAL_ENDPOINT|| 'https://www.paypal.com/cgi-bin/webscr';
var url = require('url');

function showpage(app) {
//    app.route('/').get(function (req, res, next) {
//        res.sendfile(__dirname + '/static/index.html');
//    });
//    app.route('/advanced').get(function (req, res, next) {
//        res.render('advanced', { PAYPAL_BUSINESS: PAYPAL_BUSINESS, PAYPAL_ENDPOINT: PAYPAL_ENDPOINT });
//    });
    app.get('/', function(req, res) {
        res.render('pages/index', { title: 'The index page!' })
    });
    var finals = [{url:"http://preply.com", score: "0.009"},
        {url:"http://preply.com", score: "0.009"},
        {url:"http://preply.com", score: "0.009"},
        {url:"http://preply.com", score: "0.009"},
        {url:"http://preply.com", score: "0.009"}
    ];
    app.route('/email').get(function (req, res, next) {
        res.render('prod_email', { finals: finals, N : 1500, DOMAIN: url.parse("http://preply.com").hostname });
    });


    app.route('/a13989aa54a1.html').get(function (req, res, next) {
                res.send("8719059de734");
    });
}

module.exports = showpage;