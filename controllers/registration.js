const express = require('express');
const router = express.Router();

module.exports = function(passport) {
	router.get('/', function(req, res) {
		res.render('signup');	
	});


	router.post('/', passport.authenticate('signup', {
			successRedirect: '/blog',
			failureRedirect: '/',
			failureFlash: true
		})
	);

	return router;
}
