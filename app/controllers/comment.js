var Comment = require('../models/comment');

exports.save = function(req,res) {
	var _comment = req.body.comment;
	console.log("comment: ",_comment);
	var movieId = _comment.movie;
	var comment = new Comment(_comment);

	comment.save(function(err,comment) {
		if (err) {
			console.log(err);
		}
		res.redirect('/movie/' + movieId);
	})
} 
