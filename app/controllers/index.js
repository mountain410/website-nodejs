var Movie = require('../models/movie');
var Category = require('../models/category');

// index page 
exports.index = function (req,res) {
  Category
    .find({})
    .populate({path: 'movie', options: {limit:5}})
    .exec(function(err, categories){
      if(err){
        console.error(err);
      }
      // 渲染首页'index'，并向其传数据
      res.render('index',{
        title:'电影 首页',
        categories:categories
      })
    })
}
