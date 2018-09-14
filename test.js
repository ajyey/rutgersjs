var rutgersjs = require('./index');


// rutgersjs.getStopPredictions('Nursing School').then(function(result){
// // 	console.log(result);
// // }).catch(err => console.log(err));
rutgersjs.getStops('EE').then(function(stops){
	console.log(stops)
}).catch(err => console.log(err))
