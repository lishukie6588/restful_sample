module.exports = function(){
    var express = require('express');
    var router = express.Router();


    router.get('/', function(req, res){
        console.log("@ get stocks portfolio");
        var callbackCount = 0;
        var context = {};
        //console.log("@ calendar get");
        //console.log(req.session.userID);
        context.userID = req.session.userID;
        context.jsscripts = ["./helper.js", "nav/front_nav.js", "stocks_portfolio/front_stocks_portfolio_helper.js", "stocks_portfolio/front_stocks_portfolio.js", "stocks_portfolio/front_stocks_portfolio_on_load.js"];
        
        var mysql = req.app.get('mysql');
        getUserData(res, req.session.userID, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('stocks_portfolio', context);
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
    


    router.post('/stocks_list', function(req, res){
        var callbackCount = 0;
        var context = {}; 
        var mysql = req.app.get('mysql');
        var userID = req.body.userID;
        console.log("@ post stocks_portfolio/stocks_list");
        sql = "SELECT * FROM (SELECT SUM(quantity) as sharesOwned, Stocks.symbol, Stocks.longName, Stocks.summary, Stocks.currentPrice, Stocks.highPrice, Stocks.lowPrice, Stocks.priceChange FROM Stock_bundles JOIN Stocks ON Stock_bundles.symbol = Stocks.symbol WHERE userid=? GROUP BY Stocks.symbol) AS X WHERE X.sharesOwned != 0";
        mysql.pool.query(sql, [userID], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            else {

                //console.log(results);
                //console.log("@ post stocks_portfolio/stocks_list: aboutto send results to front end ");
                res.send(results);
                return;
            }
        });
        
        //validateUserBalance(res, context, mysql, params, updateStocksEntry);
    });



    /*
    - validate that: user has a sum(quantity) Stock_bundles group by symbol entry WHERE symbol = req.body.symbol AND sum(quantity) >= req.body.quantity
     - if not valid, res.send("not_enough_shares"), return
     - if valid:
      - derive total_value from fetched entry
       - join Stocks on Stocks.symbol = Stock_bundles.symbol
       - total_value = quantity*results[0]["currentPrice"]
      - insert entry into Stock_bundles with userID, symbol, -quantity
      - update Users.balance += total_value
    */
    router.post('/sell_to_source', function(req, res){
        console.log("@ post stocks_portfolio/sell_to_source");
        var params = req.body;
        console.log(params);
        var callbackCount = 0;
        var context = {};
        //console.log("@ calendar get");
        //console.log(req.session.userID);
        //context.userID = req.session.userID;
        //context.jsscripts = ["./helper.js", "nav/front_nav.js", "stock_lookup/front_stock_lookup_helper.js", "stock_lookup/front_stock_lookup.js", "stock_lookup/front_stock_lookup_on_load.js"];
        
        var mysql = req.app.get('mysql');
        validateUserStockBundle(res, context, mysql, params);
        
    });

    function validateUserStockBundle(res, context, mysql, params) {
        
        var callbackCount = 0;
        var sql = "SELECT * FROM (SELECT Users.balance, Stock_bundles.userID, Stock_bundles.symbol, SUM(Stock_bundles.quantity) AS quantity, Stocks.currentPrice FROM Stock_bundles JOIN Stocks ON Stock_bundles.symbol = Stocks.symbol JOIN Users ON Users.userID=Stock_bundles.userID GROUP BY Stock_bundles.userID, Stock_bundles.symbol) AS A WHERE A.userID=? AND A.symbol=? AND A.quantity>=?";

        mysql.pool.query(sql, [params.userID, params.symbol, params.quantity], function(error, results, fields){
            if(error){
                console.log("@ validateUserStockBundle: mysql error")
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
                
            }
            else {
                
                //console.log("results length: ", results.length);
                //console.log("results: ", results );
                if (results.length == 0) {
                    res.send("not_enough_shares");
                    return;
                }
                else {
                    
                    console.log("params: ", params);
                    var total_price = parseFloat(results[0]["currentPrice"].toFixed(2)) * parseFloat(params["quantity"]);
                    console.log("total price: ",total_price);
                    var old_balance = parseFloat(results[0]["balance"].toFixed(2));
                    console.log("old_balance: ", old_balance);
                    var new_balance = parseFloat( ( old_balance + total_price).toFixed(2) );
                    console.log("new_balance: ", new_balance);

                    var stock_bundle_params = {userID: params.userID, symbol: params.symbol, quantity: -1 * parseInt(params.quantity)};
                    var balance_params = {balance: new_balance, userID: params.userID};

                    insertStockBundlesEntry(res, context, mysql, stock_bundle_params, complete);
                    updateUserBalance(res, context, mysql, balance_params, complete);
                }
            }

            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    
                    console.log("@ validateUserStockBundle: complete()");
                    //console.log(context);
                    res.send("sold_to_source_successfully");
                    //return;
                }
            }
            //complete();
        });

    }

    function insertStockBundlesEntry(res, context, mysql, params, complete) {
        var sql = "INSERT INTO `Stock_bundles` (`userID`, `symbol`, `quantity`) VALUES (?, ?, ?)";
        param_array = [params.userID, params.symbol, params.quantity];
        mysql.pool.query(sql, param_array, function(error, results, fields){
            if(error){
                //res.write(JSON.stringify(error));
                //res.end();
                //return;
                console.log("@ inserNewStock: mysql error");
                console.log(error);
            }
            else {
                console.log("@ insertNewStock: success");
                complete();
                //insertStockBundle(res, context, mysql, params, complete);
            }
        });
    }

    function updateUserBalance(res, context, mysql, params, complete) {
        var sql = "UPDATE `Users` SET `balance`=? WHERE `userID`=?";
        console.log("@ updateUserBalance: ");
        console.log(params);
        param_array = [params.balance, params.userID];
        mysql.pool.query(sql, param_array, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
                console.log("@ updateUserBundle: mysql error");
                console.log(error);
                return;

            }
            else {
                console.log("@updateUserBalance: success");
                complete();
            }
        });
    }


    // ========================================================================

    /* POST: stock_lookup/buy
    - validates that userID has enough balance in database for quantity*currentPrice
     - if valid: trickle down rest of route handler
     - if invalid: res.send("not_enough_balance");
     - check to see if Stocks database contains symbol:
      - if so: update existing entry with fresh data fetched from API
      - if not: add new entry with fresh data fetched from API
     - insert new Stock_bundles entry for userID, symbol, quantity
     - update userid's balance
    
    */
    router.post('/buy', function(req, res){
        console.log("@ post stock_lookup/buy");
        var params = req.body;
        console.log(params);
        var callbackCount = 0;
        var context = {};
        //console.log("@ calendar get");
        //console.log(req.session.userID);
        //context.userID = req.session.userID;
        //context.jsscripts = ["./helper.js", "nav/front_nav.js", "stock_lookup/front_stock_lookup_helper.js", "stock_lookup/front_stock_lookup.js", "stock_lookup/front_stock_lookup_on_load.js"];
        
        var mysql = req.app.get('mysql');
        validateUserBalance(res, context, mysql, params, updateStocksEntry);
        //res.send("purchase_success");
        //return;

        /*
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('stock_lookup', context);
            }

        }
        */
        
       //res.next();
       //console.log(context);
       //res.render('calendar', context);
    });


    /*
    - validates that userID has enough balance in database for quantity*currentPrice
     - if valid: trickle down rest of route handler
     - if invalid: res.send("not_enough_balance");
    */
    function validateUserBalance(res, context, mysql, params) {
        
        var callbackCount = 0;


        mysql.pool.query("SELECT balance FROM Users WHERE userID = ?", [params.userID], function(error, results, fields){
            if(error){
                console.log("@ validateUserBalance: mysql error")
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
                
            }
            else {
                var fetched_balance = results[0]["balance"].toFixed(2);
                console.log(fetched_balance);
                console.log("quantity: ", params.quantity);
                console.log("price: ", params.currentPrice);
                console.log("total: ", (params.currentPrice * params.quantity).toFixed(2));
                var total_deduction = (params.currentPrice * params.quantity).toFixed(2);
                var new_balance = (fetched_balance - total_deduction).toFixed(2);
                console.log("new_balance: ", new_balance);
                params["balance"] = new_balance;
                if (new_balance < 0) {
                    res.send("not_enough_balance");
                    return;
                }
                else {

                    updateStocksEntry(res, context, mysql, params, complete);
                    updateUserBalance(res, context, mysql, params, complete);
                }
            }

            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    
                    console.log("@ validateUserBalance complete()");
                    //console.log(context);
                    res.send("purchase_success");
                    //return;
                }
            }
            //complete();
        });

    }

    /*
    - check to see if Stocks database contains symbol:
     - if so: update existing entry with fresh data fetched from API
     - if not: add new entry with fresh data fetched from API
    */
    function updateStocksEntry(res, context, mysql, params, complete) {
        mysql.pool.query("SELECT * FROM Stocks WHERE symbol = ?", [params.symbol], function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
                return;
            }
            else {
                if (results.length == 0 ) {
                    console.log("insert: ", results.length);
                    insertNewStock(res, context, mysql, params, complete);
                }
                else {
                    console.log("update: ", results.length);
                    updateExistingStock(res, context, mysql, params, complete);
                }
            }
            //complete();
        });

    }

    function insertNewStock(res, context, mysql, params, complete) {
        var sql = "INSERT INTO `Stocks` (`symbol`, `longName`, `summary`, `currentPrice`, `highPrice`, `lowPrice`, `priceChange`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        param_array = [params.symbol, params.longName, params.summary, params.currentPrice, params.highPrice, params.lowPrice, params.priceChange];
        mysql.pool.query(sql, param_array, function(error, results, fields){
            if(error){
                //res.write(JSON.stringify(error));
                //res.end();
                //return;
                console.log("@ inserNewStock: mysql error");
                console.log(error);
            }
            else {
                console.log("@ insertNewStock: success");
                insertStockBundle(res, context, mysql, params, complete);
            }
        });
    }

    function updateExistingStock(res, context, mysql, params, complete) {
        var sql = "UPDATE `Stocks` SET `longName`=?, `summary`=?, `currentPrice`=?, `highPrice`=?, `lowPrice`=?, `priceChange`=? WHERE symbol=?";
        param_array = [params.longName, params.summary, params.currentPrice, params.highPrice, params.lowPrice, params.priceChange, params.symbol];
        mysql.pool.query(sql, param_array, function(error, results, fields){
            if(error){
                //res.write(JSON.stringify(error));
                //res.end();
                //return;
                console.log("@ updateExistingStock: mysql error");
                console.log(error);
            }
            else {
                console.log("@ updateExistingStock: success");
                insertStockBundle(res, context, mysql, params, complete);
            }
        });
    }

    function insertStockBundle(res, context, mysql, params, complete) {
        var sql = "INSERT INTO `Stock_bundles` (`userID`, `symbol`, `quantity`) VALUES (?, ?, ?)";
        param_array = [params.userID, params.symbol, params.quantity];
        mysql.pool.query(sql, param_array, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
                console.log("@ inserStockBundle: mysql error");
                console.log(error);
                return;

            }
            else {
                console.log("insertStockBundle: success");
                complete();
            }
        });
    }

    function updateUserBalance(res, context, mysql, params, complete) {
        var sql = "UPDATE `Users` SET `balance`=? WHERE `userID`=?";
        console.log("@ updateUserBalance: ");
        console.log(params);
        param_array = [params.balance, params.userID];
        mysql.pool.query(sql, param_array, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
                console.log("@ updateUserBundle: mysql error");
                console.log(error);
                return;

            }
            else {
                console.log("@updateUserBalance: success");
                complete();
            }
        });
    }

    return router;
}();


