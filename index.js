const request   = require('request');
const x2j       = require('xml2js');

const parser = new x2j.Parser({mergeAttrs: true});
const fs = require('fs');

//parse the route config file for easy access to route/stop information
const routeConfig = JSON.parse(fs.readFileSync('config/rutgersrouteconfig.json'));


//prediction variables
var predictionUrl = 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=rutgers&r=<routeTag>&s=<stopTag>'

//Function to get the stops for a specific bus route
exports.getRouteStops = function(routeTag){
    return new Promise((resolve, reject)=>{
        var routes = routeConfig.routes;
        if(!routes.hasOwnProperty(routeTag)){
            //the route tag is not valid
            reject("You have entered an invalid route tag: " + routeTag);
        }
        var stops = routeConfig.routes[routeTag].stops;
        resolve(stops);
    })
}
//Function to get route predictions for a specific route
//Returns a promise with the title of the stop and the minutes or seconds eta
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

            let requestResults;
            await Promise.all(requestPromises).then(function(result){
                requestResults = result;
            }).catch(err => reject(err));

            requestResults.forEach(element => {
                let parsedPromise = parseRequest(element);
                parsedPromises.push(parsedPromise)
            })

            let parsed;
            await Promise.all(parsedPromises).then(function(result){
                parsed = result;
            }).catch(err => reject(err));
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
                        seconds: seconds,
                        predictionAvailable:true
                    })
                }
                else{
                    predictions.push({
                        title: stopTitle,
                        minutes:null,
                        seconds:null,
                        predictionAvailable: false
                    })
                }
            })
            resolve(predictions);
        })
        .catch(err => reject(err));
    })
}

//Gets the location of a specific stop including title, latitude, and logitude
exports.getStopLocation = function(stop){
    return new Promise((resolve, reject)=>{
        let stops = routeConfig.stops;
        if(!stops.hasOwnProperty(stop)){reject("An invalid stop was passed in.")}
        var validStop = stops[stop];
        resolve({
            title: validStop.title,
            lat: Number(validStop.lat),
            lon: Number(validStop.lon)
        });
    })
}


//Gets the locations of all stops
exports.getAllStopLocations = function(){
    return new Promise((resolve, reject)=>{
        let ret = [];
        let stops = routeConfig.stops;
        for(var stop in stops){
            exports.getStopLocation(stop)
            .then(function(result){
                ret.push(result);
            })
            .catch(err=>reject(err));
        }
        resolve(ret);
    });
}

//gets stop locations based on route
exports.getStopLocationsForRoute = function(routeTag){
    return new Promise((resolve, reject)=>{
        let routes = routeConfig.routes;
        if(!routes.hasOwnProperty(routeTag)){
            //the route tag is not valid
            reject("You have entered an invalid route tag: " + routeTag);
        }
        let stops = routes[routeTag].stops;
        let ret = [];

        stops.forEach(stop => {
            exports.getStopLocation(stop)
            .then(function(result){
                ret.push(result)
            })
            .catch(err => reject(err))
        })
        resolve(ret);

    })
}














































//============================
//UTILITY FUNCTIONS
//============================
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
