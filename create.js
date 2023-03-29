module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*
    - post request to add new entry to Users 
    - res.send(result)
    - res.end()
    - front end:
     - if add succeeds, redirect to calendar
     - else, redirect back to login with username taken error msg
    - back end:
     - if user is logged in currently & accesses this route:
      - redirect back to /calendar
     - else:
      - res.send(result)
      - res.end()
    */
    router.post('/', function(req, res){

        //console.log("reached post create");
        //console.log(req.body);

        if (req.session.userID) {
            res.redirect("/calendar");
        }
        else {

            //if (req.query.status == 0) {
            //var context = {};
            //context.status = req.query.status;
            //context.jsscripts = ["login/front_login_on_load.js"];
            //res.render('login', context);
            var {userID, email, password, postalCode, city, country} = req.body;
            //console.log(userID);
            //console.log(postalCode);


            var callbackCount = 0;
            var context = {};
            //context.jsscripts = ["calendar/front_calendar_day.js", "calendar/front_calendar.js", "calendar/front_calendar_on_load.js"];
            
            var mysql = req.app.get('mysql');
            createAccount(res, [userID, email, password, postalCode, city, country], mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){

                    // *** TODO: figure out what to retrieve from results
                   req.session.userID = userID;
                   req.session.save();
                   //console.log("created new account");
                   //console.log(req.session);
                   res.write("creation_success");
                   res.end();

                }
            }

        }
    
    });


    function createAccount(res, params, mysql, context, complete){
        console.log("@createAccount: ", params);
        var sql_string = 'INSERT INTO `Users` (`userID`, `email`, `password`, `balance`, `postalCode`, `city`, `country`, `tempUnit`) VALUES (?,?,?,100000,?,?,?,1)';
        mysql.pool.query(sql_string, params, function(error, results, fields){
            if(error){
                console.log("before res.end(): creation error: taken username");
                //res.write(JSON.stringify(error));
                res.write("creation_error");
                res.end();
                return;
            }
            //console.log("after res.end() due to error");
            context.users = results;
            //console.log(context);
            //console.log(results);
            //console.log("reached compelte()");
            //complete();
            insertNewNetWorth(res, params[0], mysql, context, complete);
            
        });
    }

    function insertNewNetWorth(res, userID, mysql, context, complete) {
            var date = new Date();
            var live_year = date.getFullYear();
            var live_month = date.getMonth() + 1;
            var live_date = date.getDate() - 1;
            var net_worth_date = getDateString(live_year, live_month, live_date);
            console.log("@ insertNewNetWorth");
            var params = [userID, net_worth_date];
            console.log(params);
            console.log(params[0]);
            console.log(params[1]);
            var sql_string = 'INSERT INTO `Net_worths` (`userID`, `date`, `worth`) VALUES (?,?,100000.00)';
            mysql.pool.query(sql_string, params, function(error, results, fields){
                if(error){
                    console.log("@ insertNewNetWorth: ERROR");
                    res.write(JSON.stringify(error));
                    //res.write("creation_error");
                    res.end();
                    return;
                } 
                else {
                    complete();
                }
            })
    }

    function getDateString(year, month, date) {
        let return_string = year + "-";
        let month_string;
        let date_string;
        if (month < 10) {
            month_string = "0" + month + "-";
        }
        else {
            month_string = month + "-";
        }
        if (date < 10) {
            date_string = "0" + date;
        }
        else {
            date_string = date;
        }
        return_string += month_string;
        return_string += date_string;
        return return_string;
    }

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
                    //console.log("invalid username &/ password");
                    //res.redirect("/login");
                    res.write("invalid");
                }
                else {
                    //console.log(context.users[0].userID);
                    req.session.userID = context.users[0].userID;
                    req.session.save();
                    //console.log(req.session);
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

    
    return router;
}();

