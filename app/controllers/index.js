var Movie = require('../models/movie');

// index page 
exports.index = function (req,res) {
  console.log("req session user: ");
  console.log(req.session.user);
  // fetch函数取出数据库当前数据
  Movie.fetch(function(err,movies){
    if(err){
      console.error(err);
    }
    // 渲染首页'index'，并向其传数据
    res.render('index',{
      title:'电影 首页',
      movies:movies
    })
  })
}
