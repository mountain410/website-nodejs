// 入口文件app.js
var express = require('express');

var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var morgan = require('morgan');

//中间件用来解析http请求体,将body中的数据初始化成一个对象，如下文，可以直接用req.body 取出数据
var bodyParser = require('body-parser'); 
var app = express();                //将实例赋给变量app。express()表示创建express应用程序
var port = process.env.PORT || 3000;                    //设置端口号 process是全局变量
var dburl = 'mongodb://localhost/website-nodejs'

mongoose.connect(dburl)                                 // 连接本地数据库
app.locals.moment = require('moment');

app.set('views', './app/views/pages');                  // 设置视图的根目录
app.set('view engine', 'pug');                          // 设置默认的模版引擎

app.use(session({
  secret: 'website',
  // 保持用户信息持久化，重启服务不丢失。这里用的是mongodb方法。也可以用cookie-session方法
  store: new mongoStore({
    url: dburl,
    collection: 'sessions'
  })
}));
//prehandle user
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});
app.use(bodyParser.urlencoded({extended:true}));        // 对urlencoeded的post参数进行解析
app.use(express.static(path.join(__dirname,'public'))); // 静态资源的加载，在public目录里

var env = process.env.NODE_ENV || 'development';        // 获取当前环境
// 判断环境变量 env 是否是开发环境
if ('development' === env) {
  app.set('showStackError',true);                       // 在屏幕上将错误信息打印出来
  app.use(morgan(':method :url :status'));              // cmd控制台显示请求的类型、路径和状态
  app.locals.pretty = true;                             // 源码格式化，不要压缩
  mongoose.set('debug',true);                           // 显示数据库查询信息
}
app.listen(port);                                       //监听端口

require('./config/routes')(app)                         // 路由控制

console.log(`server started on port ${port}`);