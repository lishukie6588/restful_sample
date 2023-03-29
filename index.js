var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        });

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/static', express.static('public'));

app.set('view engine', 'handlebars');
app.set('port', 8800);

app.use('/', require('./back_restful_sample.js'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
  console.log("404 msg")
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(process.env.PORT || app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
