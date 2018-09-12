var rutgersjs = require('./index');
rutgersjs.getRoutePredictions('f').then(function(predictions){
    console.log(predictions);
})
.catch(err => console.log(err));
