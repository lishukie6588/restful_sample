module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
    router.get('/', function(req, res){

        console.log("get request to /");
        const context = {};
        context.jsscripts = ["./helper.js", "./login/front_login_on_load.js"];
        res.render('login', context);
    
    });

    router.get('/get_car', function(req, res){

        const car_specs = {type : req.query.car_type, turbo: req.query.car_turbo, fog_lights: req.query.car_fog_lights, heated_seats: req.query.car_heated_seats, autopilot: req.query.car_autopilot, sports_exhaust: req.query.car_sports_exhaust};
        const returned_car_json = JSON.stringify(car_specs);

        res.send(returned_car_json);
    
    });

    return router;
}();

