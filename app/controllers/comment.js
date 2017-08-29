var Comment = require('../models/comment');

exports.save = function(req,res) {
	var _comment = req.body.comment;
	var movieId = _comment.movie;
	//检查是否已经有cid，从而判断是评论还是回复。
	if (_comment.cid) {
		Comment.findById(_comment.cid, function(err,comment){
			var rep = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			};
			comment.reply.push(rep);
			comment.save(function(err, comment){
				if (err) {
					console.log(err);
				}
				res.redirect('/movie/' + movieId);
			})
		})
	}else {
		var comment = new Comment(_comment);

		comment.save(function(err,comment) {
			if (err) {
				console.log(err);
			}
			res.redirect('/movie/' + movieId);
		})
	}


} 
