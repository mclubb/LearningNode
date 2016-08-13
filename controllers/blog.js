var db = require('../db.js');
exports.index = (req, res) => {
	db.get().collection('posts', function(err, collection) {
		if( err ) {
			console.log(err);
		}

		collection.find({}).toArray(function(err, posts) {
			res.render('blog', {posts: posts});
		});
	});
};

exports.create = (req, res) => {
	res.render('blog_create');
};

exports.post_create = (req, res) => {
	db.get().collection('posts', function(err, collection) {
		if( err ) {
			console.log(err);
		}
		collection.insert({title:req.body.title, body:req.body.body}, function(err, result) {
			if( err ){
				console.log(err);
			}
			res.redirect('/');
		});
	});
};
