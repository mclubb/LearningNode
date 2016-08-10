var http = require('http');
var ObjectId = require('mongodb').ObjectId;
var express = require('express');
var bodyParser = require('body-parser');
var config = require('config');
var mongoClient = require('mongodb').MongoClient;
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
})); 

var db;
mongoClient.connect("mongodb://localhost:27017/todolist", function(err, database) {
	if( err ) {
		console.log("Failed to connect to mongodb");
	}

	db = database;
});


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

app.get('/', function(req, res) {
	/*var users; 
	getUsers(config.get('Endpoint.healthyway'), function(data) {
		users = data.result;
		res.render('index', {pageData: {users: users}});
	});
	*/
	db.collection('posts', function(err, collection) {
		if( err ) {
			console.log(err);
		}

		collection.find({}).toArray(function(err, posts) {
			res.render('index', {posts: posts});
		});
	});
});

app.get('/blog', function(req, res) {
	db.collection('posts', function(err, collection) {
		if( err ) {
			console.log(err);
		}

		collection.find({}).toArray(function(err, posts) {
			res.render('blog', {posts: posts});
		});
	});
});

app.get('/blog/create', function(req, res) {
	res.render('blog_create');
});

app.post('/blog/create', function(req, res) {
	db.collection('posts', function(err, collection) {
		if( err ) {
			console.log(err);
		}
		collection.insert({title:req.body.title, body:req.body.body}, function(err, result) {
			if( err ){
				console.log(err);
			}
			res.json({status: 'success', 'result': result});
		});
	});
});

app.get('/todo', function(req, res) {
	var data;
	db.collection('list', function(err, collection) {
		if( err ) {
			console.log(err);
		}
		var items = [];
		collection.find({}).toArray(function(err, items) {
			res.render('todo', {pageData: items});	
		});	
	});
});

app.post('/todo/create', function(req, res) {
	db.collection('list', function(err, collection) {
		if( err ) {
			console.log(err);
		}
		collection.insert({task:req.body.task, completed: req.body.completed}, function(err, result) {
			if( err ) {
				res.json({status: 'failed'});
			}
			res.json({status: 'success', 'result': result});
		});
	});
});

app.post('/todo/update', function(req, res) {
	db.collection('list', function(err, collection) {
		if( err ) {
			console.log(err);
		}
		collection.update({"_id":ObjectId(req.body.id)}, {$set:{'completed':req.body.completed}}, function(err, result) {
			if( err ) {
				console.log('error:', err);
			}
			res.json(result);
		});
	});
});

app.post('/todo/delete', function(req, res) {
	db.collection('list', function(err, collection) {
		if( err ) {
			console.log(err);
		}
		collection.remove({"_id":ObjectId(req.body.id)});
		res.json({status: 'success'});
	});
});

app.listen(8080, '0.0.0.0', function() {
	console.log('Starting server on port 8080' + "\n");
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
