// 编译模型。调用 mongoose.model 对传入的schemas（模式）进行编译生成构造函数 
var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
var Movie = mongoose.model('Movie',MovieSchema);

module.exports = Movie;