module.exports = function(){
    var express = require('express');
    var router = express.Router();

    
    router.get('/', function(req, res){


        console.log("get request to /");
        const context = {};
        context.jsscripts = ["./helper.js", "login/front_login_on_load.js"];
        res.render('login', context);
    
    });

    router.get('/get_car', function(req, res){

        console.log("get request to /get_car");

        // console.log(res);

        const car_specs = {car_type : req.query.car_type, car_brand: req.query.car_brand, car_model: req.query.car_model, car_color: req.query.car_color, car_year: req.query.car_year, car_mileage: req.query.car_mileage};
        const returned_car_json = JSON.stringify(car_specs);

        // console.log(returned_car_json);

        res.send(returned_car_json);

    
    });

    /*
    - validate that userid_x exists in the database & password_x matches password for userid_x stored in the database
    - if validated:
         - set req.session.userid to retrieved userid from database
         - redirect to "/calendar"
       - if not validated:
         - redirect back to get "/login" route (above) (again)
    */


    // simplified post route for testing purpose
    /*
   router.post('/', function(req, res){
    var body_params = [req.body.username, req.body.password];
    console.log(body_params);

    //var callbackCount = 0;
    var context = {};
    //context.jsscripts = ["calendar/front_calendar_day.js", "calendar/front_calendar.js", "calendar/front_calendar_on_load.js"];
    
    var mysql = req.app.get('mysql');
    var sql_string = "SELECT * FROM Users";

    mysql.pool.query(sql_string, function(error, results, fields){
            context.users = results;
            console.log(results);
        
    });
    
    res.render('login', context);
});
*/

    
    router.post('/', function(req, res){
        console.log("@ post login");
        var body_params = [req.body.username, req.body.password];
        //console.log(body_params);

        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["calendar/front_calendar_day.js", "calendar/front_calendar.js", "calendar/front_calendar_on_load.js"];
        
        var mysql = req.app.get('mysql');
        
        validate(res, body_params, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log("@ login post: context.users: ", context.users);

                if (context.users.length == 0) {

                    console.log("invalid username &/ password");
                    //res.redirect("/login");
                    res.write("invalid");
                }
                else {
                    //console.log(context.users[0].userID);
                    req.session.userID = context.users[0].userID;
                    req.session.save();
                    console.log(req.session);
                    res.write("valid");
                    //console.log(context.users[0][userID]);
                }
                res.end();
                //res.render('login', context);
            }
        }
    });

    

    function validate(res, params, mysql, context, complete){
        console.log("@ post validate");
        var sql_string = "SELECT * FROM Users WHERE userid=? AND password=?";
        mysql.pool.query(sql_string, params, function(error, results, fields){
            if(error){
                console.log("error");
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            context.users = results;
            console.log("@ post login: validate: mysql result = ", results);
            //console.log("reached compelte()");
            complete();
            
        });
    }

    router.post('/todos', function(req, res){
        var params = [req.body.year, req.body.month, req.body.date];
        var callbackCount = 0;
        //var context = {};
        //context.jsscripts = ["calendar/front_calendar_day.js", "calendar/front_calendar.js", "calendar/front_calendar_on_load.js"];
        
        var mysql = req.app.get('mysql');
        getTodos(res, params, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                //console.log(context);
                res.send(context);
            }

        }
        
       res.render('calendar', context);
    });


    
    return router;
}();

