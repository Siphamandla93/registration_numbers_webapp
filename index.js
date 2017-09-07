var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var flash = require('express-flash');
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

//
// function manageLocations(loc) {
//     if (loc === "Malmebury") {
//         return "ME"
//     } else if (loc === "Bellvile") {
//         return "CE"
//     } else if (loc === "Cape Town") {
//         return "CY"
//     }
// }

// var locations = req.body.options;


  app.get('/numberRoute/:regnumber', function(req, res){
    // console.log({number:req.params.eish});
    var num = req.params.regnumber
    res.render("numbers", {number:num});

  });

  app.get('/reg_numbers', function(req, res) {
    var num = req.params.regnumber
    models.User.find({}, function(err, results){
      if (err) {
        return next(err);
      }
    }).then(function(results){
      res.render('form', {reg: results});
    })
    
});

// var list = req.body
app.post("/reg_numbers", function(req, res, next) {
var num = req.body.name;
//res.render("form", {Reg:num});

  models.User.create({name:num},function(err, results){
        if (err){
          return next(err)
        }

        else {
          console.log(num);
        }

}).then(function(results){
  res.redirect('/reg_numbers');
});
});


    // var locations = req.body.options;


  app.set('port', (process.env.PORT || 8000));

  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
