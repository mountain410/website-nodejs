var Movie = require('../models/movie');

// index page 
exports.index = function (req,res) {
  // fetch函数取出数据库当前数据
  console.log("req session user: ");
  console.log(req.session.user);
  Movie.fetch(function(err,movies){
    if(err){
      console.error(err);
    }
    // 当匹配到路由为根目录'/'时，返回渲染首页'index'，并向其传数据
    res.render('index',{
      title:'电影 首页',
      movies:movies
    })
  })
}
