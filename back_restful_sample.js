const { auto } = require('async');

module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
    router.get('/', function(req, res){

        console.log("get request to /");
        const context = {};
        context.jsscripts = ["./helper.js", "./front_restful_sample.js"];
        res.render('restful_sample', context);
    
    });

    router.get('/get_car', function(req, res){

        class Car {

            constructor(type, turbo, fog_lights, heated_seats, autopilot, sports_exhaust){
                this.type = type;
                this.turbo = turbo;
                this.fog_lights = fog_lights; 
                this.heated_seats = heated_seats;
                this.autopilot = autopilot;
                this.sports_exhaust = sports_exhaust;
            }
        
        }

        const return_car = new Car(req.query.car_type, 
                                    req.query.car_turbo,
                                    req.query.car_fog_lights,
                                    req.query.car_heated_seats,
                                    req.query.car_autopilot,
                                    req.query.car_sports_exhaust);

        const returned_car_json = JSON.stringify(return_car);
        res.send(returned_car_json);    

    });

    return router;
}();

