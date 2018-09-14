const   request   =     require('request'),
        x2j       =     require('xml2js'),
        fs        =     require('fs'),
        path      =     require('path'),
        parser    =     new x2j.Parser({mergeAttrs: true})

//api endpoints
const predictionUrl     =   'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=rutgers&r=<routeTag>&s=<stopTag>'
const routeConfigUrl    =   'http://webservices.nextbus.com/service/publicXMLFeed?a=rutgers&command=routeConfig'



//Returns the stop titles for a specific route
exports.getRouteStops = function(routeTitle){
    return new Promise((resolve, reject)=>{
        getRouteConfig(routeConfigUrl).then(function(parsed){
            var routes = parsed.body.route;
            var stops = [];
            routes.forEach(route=>{
                if(route.title[0]===routeTitle){
                    //route found
                    let stop = route.stop;
                    stop.forEach(element => {
                        stops.push({
                            title: element.title[0],
                            tag: element.tag[0],
                        });
                    })
                    resolve({
                        routeTitle: routeTitle,
                        routeTag: route.tag[0],
                        stops: stops
                    });
                }
            })
            //route title not found
            reject("The route you requested does not exist. Please refer to the documentation to make sure you entered your route title correctly.")
        })
    })
}
//Function to get route predictions for a specific route
//Returns a promise with the title of the stop and the minutes or seconds eta
exports.getStopPredictionsForRoute = function(routeTitle){
    return new Promise((resolve,reject)=>{
        exports.getRouteStops(routeTitle)
        .then(async function(result){
            let requestPromises = [];
            let parsedPromises = [];
            let predictions = [];
            var stops = result.stops;
            for(var i = 0; i<stops.length;i++){
                let url = predictionUrl.replace("<routeTag>",result.routeTag)
                url = url.replace("<stopTag>",stops[i].tag);
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
exports.getStopLocation = function(stopTitle){
    return new Promise((resolve, reject)=>{
        getRouteConfig(routeConfigUrl).then(function(parsed){
            let routes = parsed.body.route;
            routes.forEach(route=>{
                let stops = route.stop;
                stops.forEach(stop => {
                    if(stop.title[0] === stopTitle){
                        resolve({
                            tag: stop.tag[0],
                            title: stopTitle,
                            lat: Number(stop.lat[0]),
                            lon: Number(stop.lon[0])
                        })
                    }
                })
            })
            reject("The stop you specified does not exist. Please refer to the wiki for valid stop titles.")
        }).catch(err => console.log(err));
    })
}


//Gets the locations of all stops
exports.getAllStopLocations = function(){
    return new Promise((resolve, reject)=>{
        getRouteConfig(routeConfigUrl).then(function(parsed){
            let routes = parsed.body.route
            var stopObjects = []
            routes.forEach(route => {
                let stops = route.stop;
                var present = false;
                stops.forEach(stop => {
                   stopObjects.forEach(element => {
                       if(element.title === stop.title[0] && element.tag === stop.tag[0]){
                           present = true
                       }
                   })
                   if(!present){
                       stopObjects.push({
                           tag: stop.tag[0],
                           title: stop.title[0],
                           lat: Number(stop.lat[0]),
                           lon: Number(stop.lon[0])

                       })
                   }else{
                       present = false
                   }
                })
            })
            resolve(stopObjects)
        }).catch(err => reject(err));
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

//get stop predictions
exports.getStopPredictions = function(stop){
    return new Promise((resolve, reject) => {
        var routes = routeConfig.routes;
        var routesContainingTheStop = [];
        routes.forEach(route => {
            console.log(route)
        })
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

function getRouteConfig(url){
    return new Promise((resolve,reject)=>{
        doRequest(url).then(function(response){
            parseRequest(response).then(function(parsed){
                resolve(parsed);
            }).catch(err => console.log(err))
        }).catch(err => console.log(err));

    })
}

function stopIsPresent(stop, arr){
    arr.forEach(element => {
        if(element.title[0] === stop.title[0] && element.tag[0] === stop.tag[0]){
            console.log('element: '+element.title[0])
            return true
        }
        return false
    })
}


//function to get all the 
exports.printMsg = function(){
    console.log("testing a message");
}
