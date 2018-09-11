var rutgersjs = require('./index');
// rutgersjs.getRouteStops('a',function(result){
//     console.log(result);
// });
rutgersjs.getRouteStops('ee').then(function(stops){
    console.log(stops);
})
