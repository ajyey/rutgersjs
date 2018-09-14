var rutgersjs = require('./index');
// console.log(obj.routes['ee'].stops);



// rutgersjs.getRouteStops('EE').then(function(result){
// 	console.log(result);
// }).catch(err => console.log(err));
// rutgersjs.getStopPredictionsForRoute('EE').then(function(routeStops){
// 	console.log(routeStops)
// })
// .catch(err => console.log(err));
// rutgersjs.getStopPredictions('Scott Hall').then(function(result){
// 	console.log(result);
// }).catch(err =>console.log(err))
// rutgersjs.getStopLocation('Hill Center').then(function(location){
// 	console.log(location);
// });

rutgersjs.getStopPredictions('Nursing School').then(function(result){
	console.log(result);
}).catch(err => console.log(err));
// rutgersjs.getSingleStopPrediction('EE','Scott Hall').then(function(result){
// 	console.log(result);
// }).catch(err => console.log(err))