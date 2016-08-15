const express = require('express');
const router = express.Router();

module.exports = function(passport) {
	router.get('/', function(req, res) {
		res.render('login');	
	});


	router.post('/', passport.authenticate('login', {
			successRedirect: '/?success',
			failureRedirect: '/',
			failureFlash: true
	}));

	return router;
}
