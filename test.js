var rutgersjs = require('./index');


var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('config/rutgersrouteconfig.json'))
// console.log(obj.routes['ee'].stops);


// rutgersjs.getRoutePredictions('ee').then(function(routeStops){
//     console.log(routeStops);
// })
// .catch(err => console.log(err));

// rutgersjs.getStopLocation('scott').then(function(location){
// 	console.log(location);
// });
rutgersjs.getAllStopLocations().then(function(locations){
	console.log(locations);
})