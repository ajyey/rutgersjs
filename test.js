var rutgersjs = require('./index');
rutgersjs.getRoutePredictions('ee').then(function(predictions){
    console.log(predictions);
})
.catch(err => console.log(err));
