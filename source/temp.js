/**
 * Created by Dvoiak on 29.12.2014.
 */
var async = require('async');
var N = 20;
var ranks = []; // array of ids
for (var j = 1; j <= N; j++) {
    ranks.push(j);
}
//console.log(ranks.length);
async.map(ranks, function(id, callback){

    callback(null, id );

}, function (err, results) {
    async.reduce(results, 0, function(prev, next, cb){
        setImmediate(function () { cb(null, prev + next); });

    }, function(err, sum){
//        console.log(sum);
    });

});

var fs = require('fs');
var csv = require('fast-csv');
var stream = fs.createReadStream("C:/top-1m.csv");
var request = require('request');

csv.fromStream(stream).on("data", function(data){
    var index = parseInt(data[0]);
    if (index > 1000 && index < 2000){
        var domain = data[1];
        console.log(domain);


        request.post('http://localhost:3006/api',
            { form: { domain: domain } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
//                        console.log(body)
                }
            }
        );
    }
}).on("end", function(){
    console.log("done");
});