// 入口文件app.js
var express = require('express');

var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var bodyParser = require('body-parser');

var app = express(); //将实例赋给变量app
var port = process.env.PORT || 3000; //设置端口号 process是全局变量

mongoose.connect('mongodb://localhost/website-nodejs') //连接本地数据库
app.locals.moment = require('moment');


app.set('views', './views/pages');//设置视图的根目录
app.set('view engine', 'pug');  //设置默认的模版引擎
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.listen(port); //监听端口

// index page 
app.get('/', function (req,res) {
	Movie.fetch(function(err,movies){
    if(err){
        console.error(err);
    }
    // 当匹配到路由为根目录'/'时，返回渲染首页'index'，并向其传变量
    res.render('index',{
        title:'imooc 首页',
        movies:movies
    })
	})
})

// admin page
app.get('/admin/movie',function(req,res){
  // 当匹配到路由为根目录'/admin/movie'时，返回渲染录入页'admin'，并向其传变量
  res.render('admin',{
    title:'imooc 后台录入页',
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
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title:'imooc 详情页',
            movie:movie
        })
    })
})

//admin update movie
app.get('/admin/update/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            res.render('admin',{
                title: "imooc 后台修改页",
                movie: movie
            })
        })
    }
})

// admin post movie
app.post('/admin/movie/new',function(req,res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;
    if(id !=='undefined' && id !== ''){
        console.log('有电影数据');

        Movie.findById(id,function(err,movie){
            if(err){
                console.error(err);
            }
            _movie = _.extend(movie,movieObj);
            _movie.save(function(err,movie){
                if(err){
                    console.error(err);
                }
                res.redirect('/movie/'+ movie._id)
            })
        })

    }else{
         console.log('无电影数据');
        _movie = new Movie({
            doctor:movieObj.doctor,
            title :movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })
        _movie.save(function(err,movie){
            if(err){
                console.error(err);
            }
            res.redirect('/movie/'+ movie._id)
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
            title:'imooc 列表页',
            movies:movies
        })
    })
})

// list delete movie
app.delete('/admin/list',function(req,res){
    var id = req.query.id;
    if(id){
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