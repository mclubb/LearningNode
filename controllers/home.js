var db = require('../db.js');

exports.index = (req, res) => {
	db.get().collection('posts', function(err, collection) {
		if( err ) {
			console.log(err);
		}

		collection.find({}).sort({createdAt: -1}).limit(5).toArray(function(err, posts) {
			res.render('index', {posts: posts});
		});
	});
};
