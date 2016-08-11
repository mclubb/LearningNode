exports.index = (req, res) => {
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
};

exports.create = (req, res) => {
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
};

exports.update = (req, res) => {
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
};

exports.delete = (req, res) => {
	db.collection('list', function(err, collection) {
		if( err ) {
			console.log(err);
		}
		collection.remove({"_id":ObjectId(req.body.id)});
		res.json({status: 'success'});
	});
};
