module.exports = function(){
    var express = require('express');
    var router = express.Router();

   
    // post to retrieve todo data for day thumbnail & day view
    // ****TODO: copied from users.js, modify for user info retrieval
    router.post('/', function(req, res){
        var body_params = [req.body.userID, req.body.year, req.body.month, req.body.date];
        //console.log(body_params);

        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["calendar/front_calendar_day.js", "calendar/front_calendar.js", "calendar/front_calendar_on_load.js"];
        
        var mysql = req.app.get('mysql');
        getTodos(res, body_params, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                
                //console.log("in complete() of todo post");
                //console.log(context);
                res.send(context);
                //return;
            }
        }
    });

    

    function getTodos(res, params, mysql, context, complete){
        //console.log("reached getTodos");
        //console.log(params);
        var sql_string = 'SELECT * FROM Todo_items WHERE userID=? AND year=? AND month=? AND date=?';
        mysql.pool.query(sql_string, params, function(error, results, fields){
            if(error){
                console.log("TODO MYSQL ERROR");
                res.write(JSON.stringify(error));
                res.end();
            }
            context.todos = results;
            /*
            console.log("TODO SQL SUCCESS");
            console.log(results);
            console.log("CONTEXT OBJECT AFTER todo items retrieved");
            console.log(context);
            */
            //console.log("reached compelte()");
            complete();
            
        });
    }


    router.post('/delete', function(req, res){
        var body_params = [req.body.todoID];
        //console.log(body_params);

        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["calendar/front_calendar_day.js", "calendar/front_calendar.js", "calendar/front_calendar_on_load.js"];
        
        var mysql = req.app.get('mysql');
        deleteTodo(res, body_params, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                
                //console.log("in complete() of delete todo post");
                //console.log(context);
                res.send("delete_success");
                //return;
            }
        }
    });


    function deleteTodo(res, params, mysql, context, complete){
        //console.log("reached deleteTodos");
        //console.log(params);
        var sql_string = 'DELETE FROM Todo_items WHERE todoID=?';
        mysql.pool.query(sql_string, params, function(error, results, fields){
            if(error){
                //console.log("DELETE TODO MYSQL ERROR");
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            complete();
            
        });
    }



    router.post('/update', function(req, res){
        var body_params = [req.body.content, req.body.todoID];
        //console.log(body_params);

        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["calendar/front_calendar_day.js", "calendar/front_calendar.js", "calendar/front_calendar_on_load.js"];
        
        var mysql = req.app.get('mysql');
        updateTodo(res, body_params, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                
                //console.log("in complete() of update todo post");
                //console.log(context);
                res.send("update_success");
                //return;
            }
        }
    });


    function updateTodo(res, params, mysql, context, complete){
        //console.log("reached deleteTodos");
        //console.log(params);
        var sql_string = 'UPDATE Todo_items SET content=? WHERE todoID=?';
        mysql.pool.query(sql_string, params, function(error, results, fields){
            if(error){
                console.log("UPDATE TODO MYSQL ERROR");
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            complete();
            
        });
    }


    router.post('/insert', function(req, res){
        var body_params = [req.body.userID, req.body.content, req.body.month, req.body.date, req.body.year];
        //console.log(body_params);

        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["calendar/front_calendar_day.js", "calendar/front_calendar.js", "calendar/front_calendar_on_load.js"];
        
        var mysql = req.app.get('mysql');
        insertTodo(res, body_params, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                
                //console.log("in complete() of update todo post");
                //console.log(context);
                res.send("insert_success");
                //return;
            }
        }
    });


    function insertTodo(res, params, mysql, context, complete){
        //console.log("reached insertTodos");
        //console.log(params);
        var sql_string = 'INSERT INTO `Todo_items` (`userID`, `content`, `month`, `date`, `year` ) VALUES (?,?,?,?,?)';
        mysql.pool.query(sql_string, params, function(error, results, fields){
            if(error){
                console.log("INSERT TODO MYSQL ERROR");
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            complete();
            
        });
    }

    
    return router;
}();

