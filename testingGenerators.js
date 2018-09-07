const request   = require('request');
const x2j       = require('xml2js');

var parser = new x2j.Parser({mergeAttrs: true});
const routeConfig = 'http://webservices.nextbus.com/service/publicXMLFeed?a=rutgers&command=routeConfig';


//prediction variables
var predictionUrl = 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=rutgers&r=<routeTag>&s=<stopTag>'

function* getRoutePredictions(routeTag, callback){
    yield getRouteStops('routeTag',function(err, result){
        console.log(result)
    });
     
}
function* getRouteStops(routeTag, callback){
    request(routeConfig,(err,res,body) => {
        if(err) { return callback(err, null)}
        console.log('body')
        parser.parseString(body,function(err, result){
            if(err){callback(err)};
            var data = JSON.parse(JSON.stringify(result,undefined,3));
            for(var i = 0;i<data.body.route.length;i++){
                var tag = data.body.route[i].tag[0];
                if(tag===routeTag){
                    var stops = data.body.route[i].stop;
                    var stopsJson = [];
                    stops.forEach(element => {
                        var object = {
                            tag: element.tag[0],
                            title: element.title[0],
                            lat: element.lat[0],
                            lon: element.lon[0],
                            stopId: element.stopId[0]
                        }
                        stopsJson.push(object);
                    });
                }
            }
            return callback(null,stopsJson);
        })
    })
}

getRoutePredictions('ee',function(err,result){
    console.log('test')
})