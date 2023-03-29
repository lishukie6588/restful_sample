module.exports = function(){
    var express = require('express');
    var router = express.Router();

   
    
    router.post('/', function(req, res){
        console.log("reached logout post");
        console.log(req.session.userID);
        if (req.session.userID) {
            req.session.destroy(function(err) {
                if(err) {
                    return next(err);
                } else {
                    req.session = null;
                    console.log("logout successful");
                    // should redirect to login if logout success
                    // res.redirect('/*');
                    res.send("logout_success");
                    return;
                }
            });
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

