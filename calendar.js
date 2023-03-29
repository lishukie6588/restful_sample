module.exports = function(){
    var express = require('express');
    var router = express.Router();


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //console.log("@ calendar get");
        //console.log(req.session.userID);
        context.userID = req.session.userID;
        context.jsscripts = ["./helper.js", "nav/front_nav.js", "calendar/front_calendar_day.js", "calendar/front_calendar.js", "calendar/front_calendar_on_load.js"];
        
        var mysql = req.app.get('mysql');
        getUserData(res, req.session.userID, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log("context for calender view render");
                console.log(context);
                res.render('calendar', context);
            }

        }
        
       //res.next();
       //console.log(context);
       //res.render('calendar', context);
    });


    function getUserData(res, user_id, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Users WHERE userID = ?", [user_id], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            //console.log(results[0]["balance"]);
            context.email = results[0]["email"];
            context.balance = results[0]["balance"];
            context.postalCode = results[0]["postalCode"];
            context.city = results[0]["city"];
            context.country = results[0]["country"];
            context.tempUnit = results[0]["tempUnit"];
            complete();
        });
    }
    
    return router;
}();

