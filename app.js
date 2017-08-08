// 入口文件app.js
var express = require('express');

var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var User = require('./models/user'); 
//中间件用来解析http请求体,将body中的数据初始化成一个对象，如下文，可以直接用req.body 取出数据
var bodyParser = require('body-parser'); 
var app = express(); //将实例赋给变量app。express()表示创建express应用程序
var port = process.env.PORT || 3000; //设置端口号 process是全局变量

mongoose.connect('mongodb://localhost/website-nodejs') //连接本地数据库
app.locals.moment = require('moment');


app.set('views', './views/pages');//设置视图的根目录
app.set('view engine', 'pug');  //设置默认的模版引擎
app.use(bodyParser.urlencoded({extended:true})); //对urlencoeded的post参数进行解析
app.use(express.static(path.join(__dirname,'public')));//静态资源的加载，在public目录里

app.listen(port); //监听端口
// index page 
app.get('/', function (req,res) {
	// fetch函数取出数据库当前数据
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
})

// signup
app.post('/user/signup', function(req,res) {
  var _user = req.body.user;//这是取得name=user[pwd]
  /* 获取参数数据几种方式：
   * req.params.userid 这是取得url中/:userid
   * req.query.userid 这是取得url中问号后面的 /user?userid=1 
   * req.param('userid') 已被弃用
   */
  User.findOne({name: _user.name}, function(err,user){
    if (err) {
      console.log(err);
    }
    if(user) {
      return res.redirect('/');
      // console.log('用户名已存在！')
    }else {
      var user = new User(_user);
      user.save(function (err,user) {
        if(err) {
          console.log(err);
        }
        res.redirect('/admin/userlist');
      })
    }
  })
  
})

//userlist page
app.get('/admin/userlist',function(req,res){
  User.fetch(function(err,users){
    if(err){
      console.error(err);
    }
    res.render('userlist',{
      title:'用户列表页',
      users:users
    })
  })
})

// admin page
app.get('/admin/movie',function(req,res){
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
})

// detail page
app.get('/movie/:id',function(req,res){
  var id = req.params.id;
  // 查找单条为id的数据
  Movie.findById(id,function(err,movie){
    res.render('detail',{
      title:'电影 ' + movie.title,
      movie:movie
    })
  })
})

//admin update movie
app.get('/admin/update/:id',function(req,res){
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
})

/*文档实例化 new Movie()
 *只需要调用模型（构造函数）
 *然后传入数据
 *再调用 save() 方法
 *就可以把数据传到数据库中
 */

// admin post movie
app.post('/admin/movie/new',function(req,res){
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
})
//list page
app.get('/admin/list',function(req,res){
  Movie.fetch(function(err,movies){
    if(err){
      console.error(err);
    }
    res.render('list',{
      title:'电影 列表页',
      movies:movies
    })
  })
})

// list delete movie
// 在列表页拿到浏览器的删除请求
app.delete('/admin/list',function(req,res){
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
})

console.log(`server started on port ${port}`);