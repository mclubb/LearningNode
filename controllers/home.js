var db = require('../db.js');

exports.index = (req, res) => {
	db.get().collection('posts', function(err, collection) {
		if( err ) {
			console.log(err);
		}

		collection.find({}).toArray(function(err, posts) {
			res.render('index', {posts: posts});
		});
	});
};
