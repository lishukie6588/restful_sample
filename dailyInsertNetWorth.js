module.exports = {
    insertNetWorths
};

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        });

var session = require('express-session');

var cron = require('node-cron');

var unirest = require('unirest')



const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function * asynchIterator(count , ms) {
  for (let i = 0; i < count; i++) yield delay(ms).then(() => i);
}

function promisified_fetchSymbols (){
  
    //console.log(params);
    var sql_string = 'SELECT `symbol` FROM Stocks';
    mysql.pool.query(sql_string, function(error, results, fields){
        if(error){
            console.log("TEST SELECT STOCKS from MYSQL ERROR");
            console.log(JSON.stringify(error));
            //res.end();
            return;
        }
  
        console.log("fetch stocks from database success");
  
      
        (async function loop() {
          for await (let i of asynchIterator(results.length, 220)) {
            //console.log(symbol_list[i]);
            promise_updateStocks(results[i]["symbol"]).then(
              function(result) {
                console.log(result);
              }
            );
            //test_entry_id++;
          }
        })();      
    });
  
}

// function promise_fetchStocksAPI (symbol) {
  
//     console.log("@ promise_fetchStockAPI: ", symbol);
  
//     return new Promise(function(success, reject) {
  
//       var req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary");
  
//       req.query({
//         "symbol": symbol,
//         "region": "US"
//       });
  
//       req.headers({
//         "x-rapidapi-key": "9f8d618d05mshf500f0090b3d22bp1df82bjsnf64295ed4f46",
//         "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
//         "useQueryString": true
//       });
  
  
//       req.end(function (res) {
  
//         //console.log("@ RESPONSE CALLBACK of promise_fetchStocksAPI: ", res.body)
  
//         if (res.error) {
//           reject(res.error);
//         }
  
//         else {
//           var current_price = res.body["price"]["regularMarketPrice"]["raw"].toFixed(2);
//           var high_price = res.body["price"]["regularMarketDayHigh"]["raw"].toFixed(2);
//           var low_price = res.body["price"]["regularMarketDayLow"]["raw"].toFixed(2);
//           var change = res.body["price"]["regularMarketChangePercent"]["raw"].toFixed(2);
  
//           summary = res.body["summaryProfile"]["longBusinessSummary"];
//           long_name = res.body["price"]["longName"];
//           var promise_result = [long_name, summary, current_price, high_price, low_price, change, symbol];
          
//           console.log("@ promise_fetchStockAPI: ", promise_result[6], promise_result[2], promise_result[3], promise_result[4], promise_result[5] );
//           success(promise_result);
  
//         }
        
//       });
  
//     })
  
// }
  
  
// function promise_updateStocks (symbol){
  
//     return new Promise(function(success, reject) {
//       promise_fetchStocksAPI(symbol).then(function(params) {
  
//         //console.log("@promise_updateStocks: ", params[2]);
//         var sql_string = 'UPDATE Stocks SET longName=?, summary=?, currentPrice=?, highPrice=?, lowPrice=?, priceChange=? WHERE symbol=?';
//         mysql.pool.query(sql_string, params, function(error, results, fields){
//             if(error){
//                 console.log("TEST SCHEDULED INSERT TODO MYSQL ERROR");
//                 console.log(JSON.stringify(error));
//                 //res.end();
//                 reject(JSON.stringify(error));
//             }
  
//             console.log("update sql success");
//             success("update sql success");
//             //return;
          
//       });
  
//       })
  
//     })
    
  
// }

function insertNetWorths() {
    // fetch list of userIDs & balances
    var sql_string = 'SELECT userID, balance FROM Users';
    mysql.pool.query(sql_string, function(error, results, fields){
        if(error){
            console.log("fetch list of userIDs & balances error");
            console.log(JSON.stringify(error));
            return;
        }
  
        //console.log("fetch list of userIDs & balances success");
        //console.log(results);
        //success("fetch list of userIDs & balances success");

        else {
             for (var user in results) {
               console.log(results[user]["userID"]);
               fetchStockWorth(results[user]);
               //console.log("SELECT A.balance, (A.sharesOwned*A.currentPrice) as totalStockWorth, A.sharesOwned, A.currentPrice, A.symbol, A.longName, A.summary, A.highPrice, A.lowPrice, A.priceChange FROM (SELECT Users.balance, SUM(quantity) as sharesOwned, Stocks.symbol, Stocks.longName, Stocks.summary, Stocks.currentPrice, Stocks.highPrice, Stocks.lowPrice, Stocks.priceChange FROM Stock_bundles JOIN Stocks ON Stock_bundles.symbol = Stocks.symbol JOIN Users ON Users.userID = Stock_bundles.userID WHERE Users.userID=? GROUP BY Stocks.symbol) AS A WHERE A.sharesOwned!=0");
             }
        }
      })
}

function fetchStockWorth(userID_balance) {
    var sql_string = 'SELECT SUM(Z.totalStockWorth) AS totalStockWorth FROM (SELECT Y.sharesOwned*Y.currentPrice AS totalStockWorth FROM (SELECT * FROM (SELECT SUM(quantity) as sharesOwned, Stocks.symbol, Stocks.longName, Stocks.summary, Stocks.currentPrice, Stocks.highPrice, Stocks.lowPrice, Stocks.priceChange FROM Stock_bundles JOIN Stocks ON Stock_bundles.symbol = Stocks.symbol WHERE userid=? GROUP BY Stocks.symbol) AS X WHERE X.sharesOwned != 0) AS Y) AS Z;';
    var date = new Date();
    mysql.pool.query(sql_string, [userID_balance["userID"]], function(error, results, fields){
        if(error){
            console.log("@ fetchStockWorth: fetch stock worth error");
            console.log(JSON.stringify(error));
            var log_sql =  'INSERT INTO `Logs` (`date`, `message`) VALUES(?, ?)';
            mysql.pool.query(log_sql, [date, '@ fetchStockWorth: error - ' + " " + userID_balance["userID"]], function(error, results, fields){
              if(error){
                  console.log("@ fetchStockWorth: log error");
                  console.log(JSON.stringify(error));
                  return;
              }
              else {
              }
            })
            return;
        }

        else {
            //console.log(userID_balance.userID);
            console.log("@ fetchStockWorth success: ", results);
            console.log(userID_balance.balance);
            var total_stock_worth = (results[0]["totalStockWorth"] == null) ? parseFloat(0) : parseFloat(results[0]["totalStockWorth"]);
            var log_sql =  'INSERT INTO `Logs` (`date`, `message`) VALUES(?, ?)';
            mysql.pool.query(log_sql, [date, '@ fetchStockWorth: ' + userID_balance["userID"] + " " + parseFloat(total_stock_worth)], function(error, results, fields){
              if(error){
                  console.log("@ fetchStockWorth: log error");
                  console.log(JSON.stringify(error));
                  return;
              }
              else {
                console.log("@ fetchStockWorth: total_stock_worth = ", total_stock_worth);
                var total_net_worth = parseFloat(userID_balance.balance) + parseFloat(total_stock_worth);
                checkIfNetWorthExists(userID_balance.userID, total_net_worth);
              }
            })

        }
    })
}


// check to see if there's an existing net worth entry with current date
// if so, update it with input total_net_worth
// else, insert new net worth point
function checkIfNetWorthExists(userID, total_net_worth) {
    console.log("checkIfNetWorthExists: total_net_worth: ", total_net_worth);
    var date = new Date();
    var live_year = date.getFullYear();
    var leap_year = (live_year % 4 == 0) ? (live_year % 100 != 0 ? true : (live_year % 400 == 0 ? true : false)) : false;
    var feb_last_day = leap_year ? 28 : 29;
    var live_month = date.getMonth() + 1;
    var live_date = date.getDate() - 1; // ***
    var last_dates = {"12":31, "1":30, "2":31, "3":feb_last_day, "4":31, "5":30, "6":31, "7":31, "8":30, "9":31, "10":30, "11":31};
    live_date = (live_date == 0) ? last_dates[live_month.toString()] : live_date;
    var date_string = getDateString(live_year, live_month, live_date);
    console.log(date_string);
    var sql_string = "SELECT * FROM Net_worths WHERE userID=? AND date=?";
    params = [userID, date_string]
    mysql.pool.query(sql_string, params, function(error, results, fields){
        if(error){
            mysql.pool.query(log_sql, [date, '@ checkIfNetWorthExists: error - ' + userID + " " + date_string + " " + total_net_worth], function(error, results, fields){
              if(error){
                console.log("@ checkIfNetWorthExists: error");
                console.log(JSON.stringify(error));
                return;
              }
              else {
              }
            })
            
        }

        else {

            // var pointID = results[0]["pointID"];
            var check_results = results;
            var log_sql =  'INSERT INTO `Logs` (`date`, `message`) VALUES(?, ?)';
            mysql.pool.query(log_sql, [date, '@ checkIfNetWorthExists: ' + userID + " " + parseFloat(total_net_worth)], function(error, results, fields){
              if(error){
                  console.log("@ checkIfNetWorthExists: log error");
                  console.log(JSON.stringify(error));
                  return;
              }
              else {

                if (check_results.length == 0) {
                  mysql.pool.query(log_sql, [date, '@ checkIfNetWorthExists - does not exist: ' + userID + " " + date_string + " " + parseFloat(total_net_worth)], function(error, results, fields){
                    if(error){
                        console.log("@ checkIfNetWorthExists: log error");
                        console.log(JSON.stringify(error));
                        return;
                    }
                    else {
                      insertNetWorth(userID, date_string, total_net_worth);
                    }
                  })
                }
                else {

                  mysql.pool.query(log_sql, [date, '@ checkIfNetWorthExists - exists: ' + userID + " " + date_string + " " + parseFloat(total_net_worth)], function(error, results, fields){
                    if(error){
                        console.log("@ checkIfNetWorthExists: log error");
                        console.log(JSON.stringify(error));
                        return;
                    }
                    else {
                      // updateNetWorth(results[0]["pointID"], total_net_worth);
                      updateNetWorth(check_results[0]["pointID"], total_net_worth);
                    }
                  })
                }
              }
            })

        }
    })
}


function insertNetWorth(userID, date_string, total_net_worth) {
    var sql_string = "INSERT INTO `Net_worths` (`userID`, `date`, `worth`) VALUES(?, ?, ?)";
    var date = new Date();
    params = [userID, date_string, total_net_worth]
    mysql.pool.query(sql_string, params, function(error, results, fields){
        if(error){
          mysql.pool.query(log_sql, [date, '@ insertNetWorth: error - ' + userID + " " + date_string + " " + total_net_worth], function(error, results, fields){
            if(error){
              console.log("@ insertNetWorth: error");
              console.log(JSON.stringify(error));
              return;
            }
            else {
            }
          })
        }

        else {
          var log_sql =  'INSERT INTO `Logs` (`date`, `message`) VALUES(?, ?)';
          mysql.pool.query(log_sql, [date, '@ insertNetWorth: ' + userID + " " + parseFloat(total_net_worth)], function(error, results, fields){
            if(error){
                console.log("@ checkIfNetWorthExists: log error");
                console.log(JSON.stringify(error));
                return;
            }
            else {
              console.log("@ inserNetWorth - successfully: " + userID + " " + parseFloat(total_net_worth));
            }
          })
        }
    })
}

function updateNetWorth(pointID, total_net_worth) {
  var sql_string = "UPDATE Net_worths SET worth=? WHERE pointID=?";
  var date = new Date();
  params = [total_net_worth, pointID];
  mysql.pool.query(sql_string, params, function(error, results, fields){
      if(error){

        mysql.pool.query(log_sql, [date, '@ updateNetWorth: error - ' + pointID  + " " + total_net_worth], function(error, results, fields){
          if(error){
              console.log("@ updateNetWorth: error");
              console.log(JSON.stringify(error));
              return
          }
          else {
          }
        })
      }

      else {
        var log_sql =  'INSERT INTO `Logs` (`date`, `message`) VALUES(?, ?)';
        mysql.pool.query(log_sql, [date, '@ updateNetWorth: ' + pointID + " " + parseFloat(total_net_worth)], function(error, results, fields){
          if(error){
              console.log("@ updateNetWorth: log error");
              console.log(JSON.stringify(error));
              return;
          }
          else {
            console.log("@ updateNetWorth - successfully: " + pointID + " " + parseFloat(total_net_worth));
          }
        })
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
