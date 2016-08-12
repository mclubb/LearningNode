const http = require('http');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
})); 

/**
 * Routes
 */
const homeController = require('./controllers/home');
const todoController = require('./controllers/todo');
const blogController = require('./controllers/blog');


app.set('views', './views');
app.set('view engine', 'jade');
app.locals.pretty = true;
console.log( __dirname);
app.use(sassMiddleware({
	    /* Options */
	    src: __dirname + '/sass',
	    dest: path.join(__dirname, 'public/css'),
	    debug: false,
	    outputStyle: 'compressed',
	    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
app.use(express.static(__dirname + '/public'));

app.get('/', homeController.index);
app.get('/blog', blogController.index);
app.get('/blog/create', blogController.create);
app.post('/blog/create', blogController.post_create);

app.get('/todo', todoController.index);

app.post('/todo/create', todoController.create);

app.post('/todo/update', todoController.update);

app.post('/todo/delete', todoController.delete);

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
