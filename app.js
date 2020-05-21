var express = require('express');
//var bodyParser = require('body-parser');
//var mailer = require('express-mailer');
var logger = require('./source/utils/logger');

var app = express();
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//    extended: true
//}));

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3006;
var cors = require('cors');
var serveStatic = require('serve-static');
var path = require('path');

app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'source', 'static')));
//app.set('views', path.join(__dirname, 'source', 'static'));

//require('./source/signup')(app);
//require('./source/home')(app);
//app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.redirect('https://air.if.ua/montazh-kondycioneriv.html')
});
app.get('/service', function(req, res) {
    res.redirect('https://air.if.ua/remont-kondycioneriv.html')
});
app.get('/pre-set', function(req, res) {
    res.redirect('https://air.if.ua/montazh-kondycioneriv.html')
});
app.get('/contacts', function(req, res) {
    res.redirect('https://air.if.ua')
});

app.get('/locations.kml', function(req, res) {
    res.redirect('https://air.if.ua/locations.kml')
});

app.get('/robots.txt', function(req, res) {
    res.render('robots');
});

app.get('/sitemap.xml', function(req, res) {
    
    res.redirect('https://air.if.ua/sitemap.xml')
});

app.get('/geositemap.xml', function(req, res) {
    res.redirect('https://air.if.ua/geositemap.xml')
});

app.listen(port, function () {
	logger.info('AirPair ' + port + ' ' + env);
    if (env == 'development') logger.info("http://localhost:" + port)
});
