exports.index = (req, res) => {
	db.collection('posts', function(err, collection) {
		if( err ) {
			console.log(err);
		}

		collection.find({}).toArray(function(err, posts) {
			res.render('index', {posts: posts});
		});
	});
};
