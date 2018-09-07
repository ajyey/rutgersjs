const request   = require('request');
const x2j       = require('xml2js');

var parser = new x2j.Parser({mergeAttrs: true});
const routeConfig = 'http://webservices.nextbus.com/service/publicXMLFeed?a=rutgers&command=routeConfig';


//prediction variables
var predictionUrl = 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=rutgers&r=<routeTag>&s=<stopTag>'


//When passed in a route tag, this function returns an array of json objects containing the stops on the route
exports.getRouteStops = function(routeTag, callback){
    request(routeConfig,(err,res,body) => {
        if(err) { return callback(err, null)}
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

//function to get a specific route object by routeTag
// exports.getRoute = function(routeTag){
    
// }


//function to get latitude and longitude of a stop
// exports.getStopLocation = function(routeTag){

// }


//function to get the route predictions for a specified route
exports.getRoutePredictions = function(routeTag,callback){
    exports.getRouteStops(routeTag,function(err,data){
        if(err){return callback(err,null)}
        var done = false;
        var predictionObjs = [];
        for(var i =0;i<data.length;i++){
            var minutesArr = [];
            var secondsArr = [];
            var url = predictionUrl.replace("<routeTag>",routeTag);
            url = url.replace("<stopTag>",data[i].tag);
            //request predictions from the api
            request(url, (err, res, body) => {
                if(err){ return callback(err, null)};
                parser.parseString(body, function(err, result){
                    if(err){return callback(err, null)};
                    var data = JSON.parse(JSON.stringify(result,undefined,3));
                    var stopTitle = data.body.predictions[0].stopTitle[0];
                    //This handles the case where there is no prediction for a specific route
                    if(!data.body.predictions[0].dirTitleBecauseNoPredictions){
                        var pred = data.body.predictions[0].direction[0].prediction;
                        pred.forEach(element => {
                            minutesArr.push(element.minutes[0]);
                            secondsArr.push(element.seconds[0]);
                        });
                        predictionObjs.push({
                            title: stopTitle,
                            minutes: minutesArr,
                            seconds: secondsArr
                        })
                        // console.log(predictionObjs);
                    }
                    
                })
            });
        }
        return callback(null,"data")
        
    });
    // console.log()
}


//function to get all the 
exports.printMsg = function(){
    console.log("testing a message");
}
