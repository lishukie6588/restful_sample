// var new_relic = require('newrelic');
var express = require('express');
//var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
// var request = require('request');

var app = express();
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        });

var session = require('express-session');

// var cron = require('node-cron');

// var unirest = require('unirest')
// var dailyStockUpdate = require('./dailyStockUpdate');
// var dailyInsertNetWorths = require('./dailyInsertNetWorth.js');

app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 8800);
//app.set('port', process.argv[2]);
//app.set('mysql', mysql);


// // database reset stock updater
// cron.schedule('59,9,19,29,39,49 * * * * *', () => {
//   //var current_time = new Date;
//   //console.log(current_time.getSeconds(), "10 seconds have passed");

//   //dailyStockUpdate.promisified_fetchSymbols();
//   //dailyInsertNetWorths.insertNetWorths();

// });


// cron.schedule('0 59 23,5,11,17 * * *', () => {
//   //var current_time = new Date;
//   //console.log(current_time.getSeconds(), "10 seconds have passed");

//   dailyStockUpdate.promisified_fetchSymbols();
//   //dailyInsertNetWorths.insertNetWorths();

// }, {

//   scheduled: true,
//   timezone: "America/Los_Angeles"

// });

// cron.schedule('59 59,29 * * * *', () => {
//   //var current_time = new Date;
//   //console.log(current_time.getSeconds(), "10 seconds have passed");

//   //dailyStockUpdate.promisified_fetchSymbols();
//   dailyInsertNetWorths.insertNetWorths();

// }, {

//   scheduled: true,
//   timezone: "America/Los_Angeles"

// });

// // prevent idle
// cron.schedule('0,9,19,29,39,49,59 * * * * *', () => {

//   //fetch('/login').then(res => console.log(`response-ok: ${res.ok}, status: ${res.status}`));  

//   var req = unirest("GET", "https://branch-test-revert-apid-pyjqaw.herokuapp.com/");
  
  
//   req.query({
//     "status": 0
//   });

//   req.headers({
//     "useQueryString": true
//   });

  

//   req.end(function (res) {

//     //console.log("@ RESPONSE CALLBACK of anti-idle: ", res.body)
//     console.log("prevent idle");

    
    
//   });
    
// }, {

//   scheduled: true,
//   timezone: "America/Los_Angeles"

// });


app.use('/login', require('./restful_sample.js'));

// app.use('/create', require('./create.js'));


// app.all('*', function(req, res, next){
    
//     console.log("passed through getall route");
//     console.log(req.session);

//     if (!req.session.userID) {
//         console.log("session doesn't contain userID, redirected to get login");
//         res.redirect("/login?status=0");
//     }
//     else {
//         console.log("trickle down to target route");
//         //console.log(req.session.userID);
//         next();
//     }
// });

// app.use('/calendar', require('./calendar.js'));
// app.use('/stock_lookup', require('./stock_lookup.js'));
// app.use('/stocks_portfolio', require('./stocks_portfolio.js'));
// app.use('/net_worth', require('./net_worth.js'));
// app.use('/todo', require('./todo.js'));
// app.use('/logout', require('./logout.js'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(process.env.PORT || app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
