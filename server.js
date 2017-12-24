var fortune = require('./lib/fortune.js');
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});


app.get('/', function (req, res) {
    res.render('home');
});


app.get('/header', function(req,res){
    res.set('Content-type', 'text/plain');
    var s = '';
    for(var name in req.headers){
        s+=name + '; ' + req.headers[name]+ '\n';
    }
    req.send(s);
}); 

app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/river', function () {
    res.render('tours/river');
});

app.get('/tours/group-rate', function () {
    res.render('/tours/group-rate');
});

// пользовательская страница 404 
app.use(function (req, res) {
    res.status(404);
    res.render("404");

});

// пользовательская страница 500 
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render("500");
});

app.listen(app.get('port'), function () {
    console.log('Express запущен на http://localhost:' +
        app.get('port') + '; нажмите Ctrl+Q для завершения.');
});

