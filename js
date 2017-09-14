var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var Models = require('./models/User');
var MongoUrl = process.env.MONGO_DB_URL || 'mongodb://localhost/greet';
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


// controller functions

// handles the language selected from the radio buttons
// returns the right language greet in
function manageLanguage(lang) {
    if (lang === "Afrikaans") {
        return "Hallo, "
    } else if (lang === "English") {
        return "Hello, "
    } else if (lang === "Xhosa") {
        return "Molo, "
    }
}

// handles the names that are are greeted
var nameList = [];
var namesObj = {};
var counter = 0;

function manageName(name) {
    if (namesObj[name] === undefined) {
        nameList.push(name);
        namesObj[name] = 1;
        counter++
        return name
    } else {
      return name
    }

}

//create a route that will take different username

app.get('/', function(req, res) {
    res.redirect('/greetings')
});

app.get('/greetings', function(req, res) {
    res.render('add');
});

app.post("/greetings", function(req, res, next) {
    var nameOf = {
        name : req.body.name,
        counter:1
    }

    app.get('/reset', function(req, res) {
      models.User.remove({},function(err, results){
        if (err){
          return next(err)
        }

        else {
          console.log(results.length);
          req.flash('error', 'DataBase has been seccessfuly reseted thank you')
          res.redirect('/greetings');
        }
      })

    });


    var language = req.body.language;
    if (!nameOf.name || language=== undefined){
      req.flash('error', 'Please enter a name and choose language')
      res.render('add');
    } else{
models.User.create(nameOf, function(err, results){
  // console.log(results);
  if (err) {
    if(err.code === 11000){
    models.User.findOne({name: nameOf.name}, function(err, results){
      if (results) {
        results.counter = results.counter+1
        results.save();
        res.render('add', {
          name: manageName(nameOf.name),
          language: manageLanguage(language),
          counter: results.length
        });

      }
    })
  }
}
  else {
    // console.log(results.name);
    models.User.find({},function(err, results){
      if (err){
        return next(err)
      }
      else {
        res.render('add', {
          name: manageName(nameOf.name),
          language: manageLanguage(language),
          counter: results.length
        });

      }
    })
  }
});
}    //  console.log(name);
});


app.get('/greeted', function(req, res) {
  models.User.find({},function(err, results){
    if (err){
      return next(err)
    }
    else {
      res.render('greeted', {
        Greeted: results
      });

    }
  })
    // res.render("greeted", {
    //     Greeted: nameList
    // });
});

//creating a route that will count how many time aa person has been greeted
app.get('/counter/:names', function(req, res, next) {
    var names = req.params.names;

    function CounterNames(input) {
        return input == names;
    }

models.User.findOne({name: names}, function(err, results){
  if (err) {
    return next(err)
  }
  else {

    // var CounterNames = nameList.filter(CounterNames).length;
    var name = "Hello, " + req.params.names + ' has been greeted ' + results.counter + ' times(s)'
    res.render("names", {
      names:name
    });
  }
})

});


app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
