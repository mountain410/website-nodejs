var Category = require('../models/category');

// admin add page
exports.add = function(req,res){
  // 当匹配到路由为'/admin/movie'时，返回渲染录入页'admin'，并向其传数据
  res.render('category_admin',{
    title:'电影 后台分类录入页',
    category: {}
  })
}

/*文档实例化 new Movie()
 *只需要调用模型（构造函数）
 *然后传入数据
 *再调用 save() 方法
 *就可以把数据传到数据库中
 */

// admin/movie/new post 
exports.save = function(req,res){
  var _category = req.body.category;
  
  // 新增数据
  var category = new Category(_category)
  //_movie存取数据
  category.save(function(err,category){
    if(err){
      console.error(err);
    }
    res.redirect('/admin/category/list');//跳转到该条数据的详情页
  })

}

exports.list = function(req,res){
  Category.fetch(function(err,categories){
    if(err){
      console.error(err);
    }
    res.render('categorylist',{
      title:'电影分类列表页',
      categories:categories
    })
  })
}

