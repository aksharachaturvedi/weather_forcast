var express = require('express');
var router = express.Router();
var _ = require('underscore');

var allCities = [];
var counter = 0;

//store the city and state in the hash
var statecity = new Object();
statecity['CA'] = "Campbell";
statecity['NE'] = "Omaha";
statecity['TX'] = "Austin";
statecity['MD'] = "Timonium";

//go to the home page, load the weather information for the given cities and states
exports.index = function(req, res, http){

    //call the get funciton for all the city/state combinations
    for (var k in statecity) {
        if (statecity.hasOwnProperty(k)) {
             getCityData(statecity[k], k, res, http);
        }
    }
   allCities.length=0; //clear hashes
};

//load the City and state page with 4 days of weather data
exports.weather = function (req, res, http) {

    // data for accessing the Wunderground api
    var options = {
        host: 'api.wunderground.com',
        port: 80,
        path: '/api/6329e04082774ef6/forecast/q/' + req.params.state + '/' + req.params.city + '.json',
        method: 'GET'
    };

    http.request(options, function (httpResponse) {
        httpResponse.setEncoding('utf8');

        var buffer = '';
        httpResponse.on('data', function (chunk) {
            buffer += chunk;
        });
        httpResponse.on('error', function (err) {
            console.error('ERROR: ' + err);
        });
        // render the view with the result data
        httpResponse.on('end', function () {
            var jsonBuffer = JSON.parse(buffer);

            var incity = req.params.city.substring(0, 1).toUpperCase() + req.params.city.substring(1).toLowerCase();
            incity = incity.replace("_", " "); //replace _ with space
            var instate = req.params.state.toUpperCase();

            //combine json and all the city and state
            var cityJson = _.extend(jsonBuffer, { instate: instate, incity: incity, title: 'Weather Forecaster' });

            res.render('weather', cityJson);
        });
    }).end();
};

function getCityData(inputCity, inputstate, res, http) {

    var options = {
        host: 'api.wunderground.com',
        port: 80,
        path: '/api/6329e04082774ef6/forecast/q/' + inputstate + '/' + inputCity + '.json',
        method: 'GET'
    };

    // makes the request
    http.request(options, function (httpResponse) {
        httpResponse.setEncoding('utf8');
        var buffer = '';

        httpResponse.on('data', function (chunk) {
            buffer += chunk;
        });
        httpResponse.on('error', function (err) {
            console.error('exports.cities_states->ERROR: ' + err);
        });
        // render the view
        httpResponse.on('end', function () {
            var cityStateJson = _.extend(JSON.parse(buffer),{ stateName: inputstate, cityName: inputCity});

            allCities.push(cityStateJson); //add data for all the cities/states
            counter++; //inc counter

            if(counter == Object.keys(statecity).length) {
                res.render('index', { allCities:allCities, title: 'Weather Forecaster' }); //render
                counter=0; //clear counter
            }
        });
    }).end();
}
