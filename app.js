const http = require('http');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const flash = require('connect-flash');

app.use(expressSession({secret: 'mySecretKey', saveUninitialized: true, resave: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
})); 
app.use(flash());

mongoose.connect('mongodb://localhost:27017/passport');



app.set('views', './views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(sassMiddleware({
	    /* Options */
	    src: __dirname + '/sass',
	    dest: path.join(__dirname, 'public/css'),
	    debug: false,
	    outputStyle: 'compressed',
	    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
app.use(express.static(__dirname + '/public'));

var initPassport = require('./passport/init');
initPassport(passport);

/**
 * Routes
 */
const homeController = require('./controllers/home');
const todoController = require('./controllers/todo');
const blogController = require('./controllers/blog')(passport);
const loginController = require('./controllers/login')(passport);
const signupController = require('./controllers/registration')(passport);

/* Routes */
app.get('/', homeController.index);
app.get('/todo', todoController.index);
app.post('/todo/create', todoController.create);
app.post('/todo/update', todoController.update);
app.post('/todo/delete', todoController.delete);
app.use('/blog', blogController);
app.use('/login', loginController);
app.use('/signup', signupController);

var db = require('./db.js');


db.connect('mongodb://localhost:27017/todolist', function(err) {
	if( err ) {
		console.log('Unable to connect to Mongo');
		process.exit(1);
	} else {
		app.listen(8080, '0.0.0.0', function() {
			console.log('Starting server on port 8080' + "\n");
		});
	}
});


var getUsers = function(config, callback) {
	var options = {
		host: config.host,
		port: 80,
		path: '/endpoint/authors',
		method: 'GET'
	};

	var test = http.request(options, function(res) {
		var output = '';
		res.on('data', function(chunk) {
			output += chunk;
		});

		res.on('end', function() {
			var outputObject = JSON.parse(output);
			callback( outputObject );
		});

	});

	test.end();
};
