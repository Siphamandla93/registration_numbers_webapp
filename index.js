var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var flash = require('express-flash');
// var mongoose = require('mongoose');
var session = require('express-session');
var Models = require('./models/User');
var MongoUrl = process.env.MONGO_DB_URL || 'mongodb://localhost/biggy';
var models = Models(MongoUrl);


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// app.use(express.cookieParser('keyboard cat'));
  app.use(session({secret: "keyboard cat", cookie:{ maxAge: 60000 *30}}));
  app.use(flash());


app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.redirect("/reg_numbers");
})
app.get('/Towns', function(req, res) {
	var locations = req.query.locations

  if (locations === 'All') {
		res.redirect('/');
	}
else{
  Models.registrations.find({num: {$regex : locations}}, function(err, data) {
      if (err) return err;

      res.render('form', {reg: results});
    });
 }


});

  app.get('/numberRoute/:regnumber', function(req, res){
    // console.log({number:req.params.eish});
    var num = req.params.regnumber
    res.render("numbers", {number:num});

  });


  app.get('/reg_numbers', function(req, res) {
    var num = req.params.regnumber;

      models.User.find({}, function(err, results){
      if (err){
          return next(err);
        }


      }).then(function(results){
        res.render('form', {reg: results});
      });
});


app.post("/reg_numbers", function(req, res, next) {
var num = req.body.name;
//res.render("form", {Reg:num});
if (num === "") {
  console.log("enter a reg num");
  res.redirect('/reg_numbers');

} else {
  models.User.create({name:num},function(err, results){
        if (err){
          return next(err)
        }

        else {
          req.flash('error', 'DataBase has been seccessfuly reseted thank you')
          console.log(num);
        }

}).then(function(results){
  res.redirect('/reg_numbers');
});

}
  });


    // var locations = req.body.options;


  app.set('port', (process.env.PORT || 8000));

  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
