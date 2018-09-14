var rutgersjs = require('./index');


rutgersjs.getStopPredictions('Nursing School').then(function(result){
	console.log(result);
}).catch(err => console.log(err));
