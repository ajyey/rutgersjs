var rutgersjs = require('./index');


// rutgersjs.getStopPredictions('Scott Hall').then(function(predictions){
// 	console.log(predictions);
// }).catch(err => console.log(err));
rutgersjs.getRouteList().then(function(list){
	console.log(list)
}).catch(err => console.log(err))
