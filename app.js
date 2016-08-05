var http = require('http');
var ObjectId = require('mongodb').ObjectId;
var express = require('express');
var bodyParser = require('body-parser');
var config = require('config');
var mongoClient = require('mongodb').MongoClient;
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
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	var users; 
	getUsers(config.get('Endpoint.healthyway'), function(data) {
		users = data.result;
		res.render('index', {pageData: {users: users}});
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

app.post('/todo', function(req, res) {
	db.collection('list', function(err, collection) {
		if( err ) {
			console.log(err);
		}
		collection.insert({task:req.body.task, completed: false});
		res.redirect('/todo');
	});
});

app.post('/todo/update', function(req, res) {
	db.collection('list', function(err, collection) {
		if( err ) {
			console.log(err);
		}
		console.log("Completed: " + req.body.completed);
		collection.update({"_id":ObjectId(req.body.id)}, {$set:{'completed':req.body.completed}}, function(err, result) {
			if( err ) {
				console.log('error:', err);
			}
			console.log(result);
			res.json(result);
		});
	});
});

app.listen(8080, function() {
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
