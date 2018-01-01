var fortune = require('./lib/fortune.js');
var express = require('express');
var app = express();
var formidable = require('formidable');
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);


app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});



app.use(function (req, res, next) {
    if (!res.locals.partials) { res.locals.partials = {}; }
    res.locals.partials.weatherContext = getWeatherData();
    next();
});

app.get('/', function (req, res) {
    res.render('home');
});


app.get('/header', function (req, res) {
    res.set('Content-type', 'text/plain');
    var s = '';
    for (var name in req.headers) {
        s += name + '; ' + req.headers[name] + '\n';
    }
    res.send(s);
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

app.get('/nursery-rhyme', function (req, res) {
    res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function (req, res) {
    res.json({
        animal: 'морж',
        bodyPart: 'клык'
    });
});

app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(), month: now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(303, '/error');
        console.log('recieved fields:' );
        console.log(fields);
        console.log('received files');
        console.log(files);
        res.redirect(303 , '/thank-you');
    });
});

app.use(require('body-parser').urlencoded({ extended: true }));

app.get('/news', function (req, res) {
    res.render('news', { csrf: 'CSRF token goes here' });
});

app.post('/process', function (req, res) {
    console.log('Form (from queryst):' + req.query.form);
    console.log('CSRF token (from hidden form field):' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    if (req.xnr || req.accepts('json , html') === 'json') {
        res.send({ succes: true });
    } else {
        res.redirect(303, '/thank-you');
    }
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

function getWeatherData() {
    return {
        locations: [
            {
                name: 'Brest',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'такое',
                temp: '15 C'
            },
            {
                name: 'pinsk',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'нормас',
                temp: '20 C'
            },
            {
                name: 'iv',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'бывало лучше',
                temp: '17 C'
            },
        ],
    };
}