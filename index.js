const request   = require('request');
const x2j       = require('xml2js');

var parser = new x2j.Parser({mergeAttrs: true});
const routeConfig = 'http://webservices.nextbus.com/service/publicXMLFeed?a=rutgers&command=routeConfig';





//get stop information when passed in a route tag
exports.getRouteStops = function(routeTag){
    request(routeConfig,(err,res,body) => {
        if(err) { return console.log(err)}
        parser.parseString(body,function(err, result){
            var data = JSON.parse(JSON.stringify(result,undefined,3));

            for(var i = 0;i<data.body.route.length;i++){
                if(data.body.route[i].tag===routeTag){
                    return data.body.route[i].stop;
                }
            }
        })
    });
}

exports.printMsg = function(){
    console.log("testing a message");
}