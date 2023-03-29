module.exports = {
    promisified_fetchSymbols
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

// function fetchSymbols (){

//     //console.log(params);
//     var sql_string = 'SELECT `symbol` FROM Stocks';
//     mysql.pool.query(sql_string, function(error, results, fields){
//         if(error){
//             console.log("TEST SELECT STOCKS from MYSQL ERROR");
//             console.log(JSON.stringify(error));
//             //res.end();
//             return;
//         }
  
//         console.log("fetch stocks from database success");
  
      
//         (async function loop() {
//           for await (let i of asynchIterator(results.length, 300)) {
//             //console.log(symbol_list[i]);
//             fetchStocksAPI(results[i]["symbol"]);
//             //test_entry_id++;
//           }
//         })();      
//     });
  
// }


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

        var symbol_results = results;
        var date = new Date();
        var log_sql =  'INSERT INTO `Logs` (`date`, `message`) VALUES(?, ?)';
        mysql.pool.query(log_sql, [date, '@ promisifed_fetchSymbols: all symbols fetched sucessfully'], function(error, results, fields){
          if(error){
              console.log("@ promisified_fetchSymbols: log error");
              console.log(JSON.stringify(error));
              return;
          }
          else {
            console.log("@ promisified_fetchSymbols: all symbols fetched successfully");
            (async function loop() {
              for await (let i of asynchIterator(symbol_results.length, 2000)) {
                //console.log(symbol_list[i]);
                promise_updateStocks(symbol_results[i]["symbol"]).then(
                  function(result) {
                    console.log(result);
                  }
                );
                //test_entry_id++;
              }
            })()

          }
        })
  
        // console.log("fetch stocks from database success");
  
      
        // (async function loop() {
        //   for await (let i of asynchIterator(results.length, 1000)) {
        //     //console.log(symbol_list[i]);
        //     promise_updateStocks(results[i]["symbol"]).then(
        //       function(result) {
        //         console.log(result);
        //       }
        //     );
        //     //test_entry_id++;
        //   }
        // })();      
    });
  
}

function promise_fetchStocksAPI (symbol) {
  
    console.log("@ promise_fetchStockAPI: ", symbol);
  
    return new Promise(function(success, reject) {
  
      var req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary");
  
      req.query({
        "symbol": symbol,
        "region": "US"
      });
  
      req.headers({
        "X-RapidAPI-Key": "4df937d51dmsh727e46affe67ce1p1e86dfjsnb0c5d32a4e94",
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "useQueryString": true
      });
  
  
      req.end(function (res) {
  
        //console.log("@ RESPONSE CALLBACK of promise_fetchStocksAPI: ", res.body)
  
        if (res.error) {
          reject(res.error);
        }
  
        else {
          var current_price = res.body["price"]["regularMarketPrice"]["raw"].toFixed(2);
          var high_price = res.body["price"]["regularMarketDayHigh"]["raw"].toFixed(2);
          var low_price = res.body["price"]["regularMarketDayLow"]["raw"].toFixed(2);
          var change = res.body["price"]["regularMarketChange"]["raw"].toFixed(2);
  
          summary = res.body["summaryProfile"]["longBusinessSummary"];
          long_name = res.body["price"]["longName"];
          var promise_result = [long_name, summary, current_price, high_price, low_price, change, symbol];
          
          console.log("@ promise_fetchStockAPI: ", promise_result[6], promise_result[2], promise_result[3], promise_result[4], promise_result[5] );

          var date = new Date();
          var log_sql =  'INSERT INTO `Logs` (`date`, `message`) VALUES(?, ?)';
          mysql.pool.query(log_sql, [date, '@ promise_fetchStocksAPI: success - ' + symbol + " " + promise_result[6] + " " + promise_result[2] + " " + promise_result[3] + " " + promise_result[4] + " " + promise_result[5]], function(error, results, fields){
            if(error){
                console.log("@ promise_fetchStocksAPI: log error");
                console.log(JSON.stringify(error));
                return;
            }
            else {
              success(promise_result);
            }
          })

          // success(promise_result);
  
        }
        
      });
  
    })
  
}
  
  
  
// function fetchStocksAPI (symbol) {
  
//     var req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary");
  
//     req.query({
//       "symbol": symbol,
//       "region": "US"
//     });
  
//     req.headers({
//       "X-RapidAPI-Key": "4df937d51dmsh727e46affe67ce1p1e86dfjsnb0c5d32a4e94",
//       "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
//       "useQueryString": true
//     });
  
  
//     req.end(function (res) {
//       if (res.error) {
//         return (res.error);
//       }
//       //throw new Error(res.error);
  
//       //console.log(res.body);
//       console.log(symbol, current_price, high_price, low_price, change);
//       var current_price = res.body["price"]["regularMarketPrice"]["raw"].toFixed(2);
//       var high_price = res.body["price"]["regularMarketDayHigh"]["raw"].toFixed(2);
//       var low_price = res.body["price"]["regularMarketDayLow"]["raw"].toFixed(2);
//       var change = res.body["price"]["regularMarketChange"]["raw"].toFixed(2);
  
//       summary = res.body["summaryProfile"]["longBusinessSummary"];
//       long_name = res.body["price"]["longName"];
      
//       updateStocks([long_name, summary, current_price, high_price, low_price, change, symbol]);
//     });
  
// }
  
  
function promise_updateStocks (symbol){
  
    return new Promise(function(success, reject) {
      promise_fetchStocksAPI(symbol).then(function(params) {
  
        //console.log("@promise_updateStocks: ", params[2]);
        var sql_string = 'UPDATE Stocks SET longName=?, summary=?, currentPrice=?, highPrice=?, lowPrice=?, priceChange=? WHERE symbol=?';
        mysql.pool.query(sql_string, params, function(error, results, fields){
            if(error){
                console.log("TEST SCHEDULED INSERT TODO MYSQL ERROR");
                console.log(JSON.stringify(error));
                //res.end();
                reject(JSON.stringify(error));
            }
  
            var date = new Date();
            var log_sql =  'INSERT INTO `Logs` (`date`, `message`) VALUES(?, ?)';
            mysql.pool.query(log_sql, [date, '@ promise_updateStocks: success - ' + symbol], function(error, results, fields){
              if(error){
                  console.log("@ promise_updateStocks: log error");
                  console.log(JSON.stringify(error));
                  return;
              }
              else {
                console.log("update symbol success: " + symbol);
                success("update symbol success: " + symbol);
              }
            })


            // console.log("update sql success");
            // success("update sql success");
            //return;
          
      });
  
      })
  
    })
    
  
}
  
// function updateStocks (params){
  
//     console.log(params);
//     var sql_string = 'UPDATE Stocks SET longName=?, summary=?, currentPrice=?, highPrice=?, lowPrice=?, priceChange=? WHERE symbol=?';
//     mysql.pool.query(sql_string, params, function(error, results, fields){
//         if(error){
//             console.log("TEST SCHEDULED INSERT TODO MYSQL ERROR");
//             console.log(JSON.stringify(error));
//             //res.end();
//             return;
//         }
  
//         console.log("update sql success");
//         return;
        
//     });
  
// }
