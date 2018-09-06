const request   = require('request');
const x2j       = require('xml2js');

var parser = new x2j.Parser({mergeAttrs: true});
const routeConfig = 'http://webservices.nextbus.com/service/publicXMLFeed?a=rutgers&command=routeConfig';


//When passed in a route tag, this function returns an array of json objects containing the stops on the route
exports.getRouteStops = function(routeTag){
    request(routeConfig,(err,res,body) => {
        if(err) { return console.log(err)}
        parser.parseString(body,function(err, result){
            var data = JSON.parse(JSON.stringify(result,undefined,3));
            console.log('here');
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
                    return stopsJson;
                }
            }
        })
    });
}

exports.printMsg = function(){
    console.log("testing a message");
}