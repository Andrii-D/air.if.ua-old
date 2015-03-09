/**
 * Created by Dvoiak on 09.03.2015.
 */

var _ = require('underscore');
var moment = require('moment');
var config = require('../config');
var logger = require('./utils/logger');
var client = require('./utils/redis');
var parser = require('url');
var sys   = require('sys');
var whois = require('node-whois');

function dateFormat (date, fstr, utc) {
    utc = utc ? 'getUTC' : 'get';
    return fstr.replace (/%[YmdHMS]/g, function (m) {
        switch (m) {
            case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
            case '%m': m = 1 + date[utc + 'Month'] (); break;
            case '%d': m = date[utc + 'Date'] (); break;
            case '%H': m = date[utc + 'Hours'] (); break;
            case '%M': m = date[utc + 'Minutes'] (); break;
            case '%S': m = date[utc + 'Seconds'] (); break;
            default: return m.slice (1); // unknown code, remove %
        }
        // add leading zero if required
        return ('0' + m).slice (-2);
    });
}
function getDomain(url) {
    var hostName = parser.parse(url).hostname;
    var domain = hostName;

    if (hostName != null) {
        var parts = hostName.split('.').reverse();

        if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0];

            if (hostName.toLowerCase().indexOf('.co.uk') != -1
                && parts.length > 2) {
                domain = parts[2] + '.' + domain;
            }
        }
    }

    return domain;
}

function treat(domain, update){
    var update = update || false;
    try {
        client.zscore("EXPIRED", domain, function(e, r){
            if (!r || update){
                whois.lookup(domain, {"follow":  1}, function(err, data) {
                    if (!!data){
                        data.split('\r\n').forEach(function(element){
                            if (element.indexOf('Registrar Registration Expiration Date:') == 0){
                                var d = new Date(element.substring(40));
                                console.log(d.getTime());
                                client.zadd("EXPIRED", d.getTime(), domain, function(err, resp){
                                    if (resp == '1'){
                                        console.log(domain + " expires " + d);
                                    }

                                });
                                return;
                            }
                        });
                    }

                });
            } else {
                console.log(domain + " already in our database");
            }
        });
    } catch (err) {
        Logger.error(err);
    }


}


function domains(app) {
    app.post('/domains/api', function(req, res) {
        console.log(req.body);
        var update = req.body.update || false;
        if (!req.body.domain){
            var domain = getDomain(req.body.url);
            process.nextTick(function() { treat(domain, update); });
        } else {
            process.nextTick(function() { treat(req.body.domain, update); });
        }
        res.send('ok');

    });
    app.route('/domains').get(function (req, res, next) {
        process.nextTick(function() {
            client.zrange("EXPIRED", 0, 100, function(e, r){
                var top = [];
                var t = new Date();
                r.forEach(function(element, index){
                    client.zscore("EXPIRED", element, function(er, re){
                        var d = new Date(parseInt(re));
                        var today = (d.getUTCDate() == t.getUTCDate() && d.getUTCMonth() == t.getUTCMonth() && d.getUTCFullYear() == t.getUTCFullYear());
                        var old = (+t > +d);
                        var coming = old && ((+d) - (+t) < 10800000);
                        top.push({id: index,
                            domain: element,
                            expires: dateFormat(d, "%d.%m.%Y %H:%M:%S", true),
                            today: today,
                            old: old,
                            coming: coming

                        });

                    });
                });
                setTimeout(function() {
                    res.render('domains/index.html', {domains: top})
                }, 300);

            })
        });

    });
}

module.exports = domains;
