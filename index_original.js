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

var unirest = require('unirest');

app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);



// asynch iterator
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function * asynchIterator(count , ms) {
  for (let i = 0; i < count; i++) yield delay(ms).then(() => i);
}

// TODO: fetch all symbols from database, then put the following in the callback():
//        - iterate through all fetched entries (symbols) with asynch iterator
//        - & update call updateStockPriceInDatabase(current_symbol)



cron.schedule('59,9,19,29,39,49 * * * * *', () => {
  var current_time = new Date;
  console.log(current_time.getSeconds(), "10 seconds have passed");

  console.log("test fetch stock symbols from database");
  fetchSymbols(mysql);

})

function fetchSymbols(mysql){

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
          fetchStocksAPI(results[i]["symbol"]);
          //test_entry_id++;
        }
      })();      
  });

}


function fetchStocksAPI(symbol) {

  var req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary");

  req.query({
    "symbol": symbol,
    "region": "US"
  });

  req.headers({
    "x-rapidapi-key": "9f8d618d05mshf500f0090b3d22bp1df82bjsnf64295ed4f46",
    "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
    "useQueryString": true
  });


  req.end(function (res) {
    if (res.error) {
      return (res.error);
    }
    //throw new Error(res.error);

    //console.log(res.body);
    console.log(symbol, current_price, high_price, low_price, change);
    var current_price = res.body["price"]["regularMarketPrice"]["raw"].toFixed(2);
    var high_price = res.body["price"]["regularMarketDayHigh"]["raw"].toFixed(2);
    var low_price = res.body["price"]["regularMarketDayLow"]["raw"].toFixed(2);
    var change = res.body["price"]["regularMarketChange"]["raw"].toFixed(2);

    summary = res.body["summaryProfile"]["longBusinessSummary"];
    long_name = res.body["price"]["longName"];
    
    updateStocks(mysql, [long_name, summary, current_price, high_price, low_price, change, symbol]);
  });

}


function updateStocks(mysql, params){

  console.log(params);
  var sql_string = 'UPDATE Stocks SET longName=?, summary=?, currentPrice=?, highPrice=?, lowPrice=?, priceChange=? WHERE symbol=?';
  mysql.pool.query(sql_string, params, function(error, results, fields){
      if(error){
          console.log("TEST SCHEDULED INSERT TODO MYSQL ERROR");
          console.log(JSON.stringify(error));
          //res.end();
          return;
      }

      console.log("update sql success");
      return;
      
  });

}


app.use('/login', require('./login.js'));

app.use('/create', require('./create.js'));


app.all('*', function(req, res, next){
    
    console.log("passed through getall route");
    console.log(req.session);

    if (!req.session.userID) {
        console.log("session doesn't contain userID, redirected to get login");
        res.redirect("/login?status=0");
    }
    else {
        console.log("trickle down to target route");
        //console.log(req.session.userID);
        next();
    }
});

app.use('/calendar', require('./calendar.js'));
app.use('/todo', require('./todo.js'));
app.use('/logout', require('./logout.js'));


app.use('/', function(req, res){
  res.status(200);
  res.render('homepage');
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
