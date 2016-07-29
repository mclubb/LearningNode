var http = require('http');
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
})); 
var connection = mysql.createConnection({
      host     : '192.168.1.140',
      user     : 'todo_app',
      password : 'calaboca',
      database : 'todo'
});

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
	var users; 
	getUsers(function(data) {
		users = data.result;
		res.render('index', {pageData: {users: users}});
	});
});

app.get('/todo', function(req, res) {
	var data;
	connection.query('SELECT * FROM todo', function (err, results, fields) {
		data = results;	
		res.render('todo', {pageData: data});
	});
	
});

app.post('/todo', function(req, res) {
	console.log(req.body);

	connection.query('INSERT INTO todo SET ?', {task:req.body.task}, function(err, rows) {
		res.render('todo');
	});

});

app.listen(8080, function() {
	console.log('Starting server on port 8080' + "\n");
});


var getUsers = function(callback) {
	var options = {
		host: 'www.healthyway.com',
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
