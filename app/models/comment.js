// 编译模型。调用 mongoose.model 对传入的schemas（模式）进行编译生成构造函数 
var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('Comment', CommentSchema); //编译生成model模型，生成构造函数Comment

module.exports = Comment;