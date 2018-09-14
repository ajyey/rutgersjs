var rutgersjs = require('./index');
// console.log(obj.routes['ee'].stops);



// rutgersjs.getRouteStops('EE').then(function(result){
// 	console.log(result);
// }).catch(err => console.log(err));
// rutgersjs.getStopPredictionsForRoute('EE').then(function(routeStops){
//     console.log(routeStops);
// })
// .catch(err => console.log(err));

// rutgersjs.getStopLocation('Hill Center').then(function(location){
// 	console.log(location);
// });
rutgersjs.getAllStopLocations().then(function(locations){
	console.log(locations)
}).catch(err=>console.log(err))
// rutgersjs.getStopPredictions('scott').then(function(result){
// 	console.log(result);
// }).catch(err => console.log(err));