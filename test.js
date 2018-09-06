var rutgersjs = require('./index');
// rutgersjs.getRouteStops('a',function(result){
//     console.log(result);
// });
rutgersjs.getRoutePredictions('ee',function(err,result){
    console.log(result);
})
