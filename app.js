// 入口文件app.js

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.set('/', 'views')
app.set('view engine', 'jade');
app.listen(port)

// index page
app.get('/1', function (req,res) {
	res.render('index',{title:'myProject 首页'});
})

// admin page
app.get('/2:id', function (req,res) {
	res.render('admin',{title:'myProject 后台录入页'});
})

// list page
app.get('/3', function (req,res) {
	res.render('list',{title:'myProject 列表页'});
})

// detail page
app.get('/4', function (req,res) {
	res.render('detail',{title:'myProject 详情页'});
})

console.log(`server started on port ${port}`);