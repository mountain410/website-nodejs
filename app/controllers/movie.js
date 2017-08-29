var _ = require('underscore');
var Movie = require('../models/movie');
var Comment = require('../models/comment');

// admin add page
exports.add = function(req,res){
  // 当匹配到路由为'/admin/movie'时，返回渲染录入页'admin'，并向其传数据
  res.render('admin',{
    title:'电影 后台录入页',
    movie:{
      title:'',
      doctor:'',
      country:'',
      year:'',
      language:'',
      summary:'',
      poster:'',
      flash:''
    }
  })
}

// detail page
exports.detail = function(req,res){
  var id = req.params.id;
  // 查找单条为id的数据
  Movie.findById(id,function(err,movie){
    Comment
    .find({movie:id})
    .populate('from', 'name')
    .populate('reply.from reply.to', 'name')
    .exec(function(err,comments){
      res.render('detail',{
        title:'电影 ' + movie.title,
        movie:movie,
        comments: comments
      })
    })
  })
}

//admin update movie
exports.update = function(req,res){
  var id = req.params.id;
  if(id){
  // 查找单条为id的数据
    Movie.findById(id,function(err,movie){
      res.render('admin',{
        title: "电影 后台修改页",
        movie: movie
      })
    })
  }
}

/*文档实例化 new Movie()
 *只需要调用模型（构造函数）
 *然后传入数据
 *再调用 save() 方法
 *就可以把数据传到数据库中
 */

// admin/movie/new post 
exports.save = function(req,res){
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie = null;
  if(id !=='undefined' && id !== ''){
    // 查找单条为id的数据
    Movie.findById(id,function(err,movie){
      if(err){
        console.error(err);
      }
      // 更新原有数据
      _movie = _.extend(movie,movieObj); //会把movieObj的所有数据覆盖到movie上
      _movie.save(function(err,movie){
        if(err){
          console.error(err);
        }
        res.redirect('/movie/'+ movie._id);//跳转到该条数据的详情页
      })
    })

  }else{
    // 新增数据
    _movie = new Movie({ //Movie实例化 _movie
      doctor:movieObj.doctor,
      title :movieObj.title,
      country:movieObj.country,
      language:movieObj.language,
      year:movieObj.year,
      poster:movieObj.poster,
      summary:movieObj.summary,
      flash:movieObj.flash
    })
    //_movie存取数据
    _movie.save(function(err,movie){
      if(err){
        console.error(err);
      }
      res.redirect('/movie/'+ movie._id);//跳转到该条数据的详情页
    })
  }
}
//list page
exports.list = function(req,res){
  Movie.fetch(function(err,movies){
    if(err){
      console.error(err);
    }
    res.render('list',{
      title:'电影 列表页',
      movies:movies
    })
  })
}

// list delete movie
// 在列表页拿到浏览器的删除请求
exports.del = function(req,res){
  var id = req.query.id;//id是通过"?"后面追加的，用query来获取
  if(id){
    // 数据库单条删除：remove() 方法内传入特定的key和value
    Movie.remove({_id:id},function(err,movie){
      if(err){
        console.error(err);
      }else{
        res.json({success:1})
      }
    })
  }
}
