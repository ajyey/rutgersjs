const request   = require('request');
const x2j       = require('xml2js');

const parser = new x2j.Parser({mergeAttrs: true});
// const routeConfig = 'http://webservices.nextbus.com/service/publicXMLFeed?a=rutgers&command=routeConfig';
const fs = require('fs');
//parse the route config file for easy access to route/stop information
const routeConfig = JSON.parse(fs.readFileSync('config/rutgersrouteconfig.json'));

//prediction variables
var predictionUrl = 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=rutgers&r=<routeTag>&s=<stopTag>'


//When passed in a route tag, this function returns an array of json objects containing the stops on the route
// exports.getRouteStops = function(routeTag){
//     return new Promise((resolve, reject)=> {
//         request(routeConfig,(err,res,body) => {
//             if(err) {reject("Something went wrong when requesting the url")}
//             parser.parseString(body,function(err, result){
//                 if(err){reject("Something went wrong parsing the api response")};
//                 var routes = JSON.parse(JSON.stringify(result,undefined,3));
//                 for(var i = 0;i<routes.body.route.length;i++){
//                     var tag = routes.body.route[i].tag[0];
//                     if(tag===routeTag){
//                         var stops = routes.body.route[i].stop;
//                         var stopsJson = [];
//                         stops.forEach(element => {
//                             var object = {
//                                 tag: element.tag[0],
//                                 title: element.title[0],
//                                 lat: element.lat[0],
//                                 lon: element.lon[0],
//                                 stopId: element.stopId[0]
//                             }
//                             stopsJson.push(object);
//                         });
//                     }
//                 }
//                 resolve(stopsJson);
//             })
//         })
//     })
// }
exports.getRouteStops = function(routeTag){
    return new Promise((resolve, reject)=>{
        var routes = routeConfig.routes;
        if(!routes.hasOwnProperty(routeTag)){
            //the route tag is not valid
            reject("You have entered an invalid route tag: "+routeTag);
        }
        var stops = routeConfig.routes[routeTag].stops;
        resolve(stops);
    })
}

//function to get a specific route object by routeTag
// exports.getRoute = function(routeTag){
    
// }


//function to get latitude and longitude of a stop
// exports.getStopLocation = function(routeTag){

// }


// function to get the route predictions for a specified route
// exports.getRoutePredictions = function(routeTag){
//     return new Promise((resolve, reject)=>{
//         exports.getRouteStops(routeTag)
//         .then(async function(routes){
//                 var predictionObjs = [];
//                 for(var i =0;i<routes.length;i++){
//                     var minutesArr = [];
//                     var secondsArr = [];
//                     var url = predictionUrl.replace("<routeTag>",routeTag);
//                     url = url.replace("<stopTag>",routes[i].tag);
//                     //request predictions from the api
//                     let req = await doRequest(url);
//                     let parsed = await parseRequest(req);
//                     var stopTitle = parsed.body.predictions[0].stopTitle[0];
//                     //This handles the case where there is no prediction for a specific route
//                     if(!parsed.body.predictions[0].dirTitleBecauseNoPredictions){

//                         var pred = parsed.body.predictions[0].direction[0].prediction;
//                         pred.forEach(element => {
//                             minutesArr.push(element.minutes[0]);
//                             secondsArr.push(element.seconds[0]);
//                         });
//                         predictionObjs.push({
//                             title: stopTitle,
//                             minutes: minutesArr,
//                             seconds: secondsArr
//                         })
//                     }

//                 }
//                 resolve(predictionObjs);
//         })
//         .catch(err => console.log(err));
//     })
// }
exports.getRoutePredictions = function(routeTag){
    return new Promise((resolve,reject)=>{
        exports.getRouteStops(routeTag)
        .then(async function(stops){
            let requestPromises = [];
            let parsedPromises = [];
            let predictions = [];
            for(var i = 0; i<stops.length;i++){
                let url = predictionUrl.replace("<routeTag>",routeTag);
                url = url.replace("<stopTag>",stops[i]);
                let promise = doRequest(url);
                requestPromises.push(promise);
            }
            let allRes = await Promise.all(requestPromises)
            allRes.forEach(element => {
                let parsedPromise = parseRequest(element);
                parsedPromises.push(parsedPromise)
            })
            let parsed = await Promise.all(parsedPromises);
            parsed.forEach(element => {
                let minutes = [];
                let seconds = [];
                let stopTitle = element.body.predictions[0].stopTitle[0];

                if(!element.body.predictions[0].dirTitleBecauseNoPredictions){
                    let pred = element.body.predictions[0].direction[0].prediction;
                    pred.forEach(element => {
                        minutes.push(element.minutes[0]);
                        seconds.push(element.seconds[0]);
                    });
                    predictions.push({
                        title: stopTitle,
                        minutes: minutes,
                        seconds: seconds
                    })
                }
            })
        
            console.log(predictions)
            // resolve(predictions);
        })
        .catch(err => console.log(err));
    })
}
function doRequest(url){
    return new Promise((resolve, reject)=>{
        request(url, (err, res, body) => {
            if(err){ reject("There was an error getting the predictions for the specified route")};
            resolve(body);
    
        });
    })
}
function parseRequest(body){
    return new Promise((resolve, reject)=>{
        parser.parseString(body, function(err, result){
            if(err){reject("There was an error parsing the result from predictions request")};
            var routes = JSON.parse(JSON.stringify(result,undefined,3));
            resolve(routes);
        })
    })
}


//function to get all the 
exports.printMsg = function(){
    console.log("testing a message");
}
