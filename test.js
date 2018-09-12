var rutgersjs = require('./index');


var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('config/rutgersrouteconfig.json'))
// console.log(obj.routes['ee'].stops);


rutgersjs.getRoutePredictions('ee').then(function(routeStops){
    console.log(routeStops);
})
.catch(err => console.log(err));
