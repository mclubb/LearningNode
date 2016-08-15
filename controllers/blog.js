const db = require('../db.js');
const express = require('express');
const router = express.Router();

const isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) {
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}
module.exports = function(passport) {
	router.get('/', function (req, res) {
		db.get().collection('posts', function(err, collection) {
			if( err ) {
				console.log(err);
			}

			collection.find({}).toArray(function(err, posts) {
				res.render('blog', {posts: posts});
			});
		});
	});

	router.get('/create', isAuthenticated, function(req, res) {
		res.render('blog_create');
	});

	router.post('/create', isAuthenticated, function(req, res) {
		db.get().collection('posts', function(err, collection) {
			if( err ) {
				console.log(err);
			}
			var date = new Date();
			collection.insert({title:req.body.title, body:req.body.body, createdAt: date}, function(err, result) {
				if( err ){
					console.log(err);
				}
				res.redirect('/');
			});
		});
	});

	return router;
}
