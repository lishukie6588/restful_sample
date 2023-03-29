module.exports = function(){
    var express = require('express');
    var router = express.Router();

   
    // post to retrieve user data for calendar view
    // ****TODO: copied from login.js, modify for user info retrieval
    router.post('/', function(req, res){
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
        var sql_string = "SELECT * FROM Users WHERE userid=? AND password=?";
        mysql.pool.query(sql_string, params, function(error, results, fields){
            if(error){
                console.log("error");
                res.write(JSON.stringify(error));
                res.end();
            }
            context.users = results;
            //console.log(results);
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

