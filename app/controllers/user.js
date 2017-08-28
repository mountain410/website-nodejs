var User = require('../models/user'); 

// showSignup 
exports.showSignup = function(req,res){
  res.render('signup',{
    title:'用户注册'
  })
}
// showSignin 
exports.showSignin = function(req,res){
  res.render('signin',{
    title:'用户登录'
  })
}

/* 获取参数数据几种方式：
 * req.params.userid 这是取得url中/:userid
 * req.query.userid 这是取得url中问号后面的 /user?userid=1 
 * req.param('userid') 已被弃用
 */
// signup post
exports.signup = function(req,res) {
  // 没有判断 body.user 假设是正确的我们需要的
  var _user = req.body.user;            //这是取得name=user[pwd]
  User.findOne({name: _user.name}, function(err,user){
    if (err) {
      console.error(err);
    }
    if(user) {
      console.log('用户名已存在！');
      return res.redirect('/signin');
    }else {
      var user = new User(_user);       // 生成用户数据
      user.save(function (err,user) {
        if(err) {
          console.error(err);
        }
        res.redirect('/');
      })
    }
  })
}

// signin post
exports.signin = function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  // 查找单条数据
  User.findOne({ name: name }, function(err, user){
    if(err){
      console.error(err);
    }
    // 如果用户不存在，直接返回首页
    if (!user) {
      console.log('用户不存在');
      return res.redirect('/signup');
    }
    // 如果用户存在，拿到用户密码（解密后）
    user.comparePassword(password, function(err, isMatch){
      if (err) {
        console.error(err);
      }
      if(isMatch){
        req.session.user = user;      // 将当前登录用户名保存到session中
        return res.redirect('/');
      }else {
        console.log('password is not matched');
        return res.redirect('/signin');
      }
    })
  })
}

// logout page
exports.logout = function(req, res) {
  delete req.session.user;
  console.log('登出成功！');
  res.redirect('/');
}

//userlist page
exports.userlist = function(req,res){
  User.fetch(function(err,users){
    if(err){
      console.error(err);
    }
    res.render('userlist',{
      title:'用户列表页',
      users:users
    })
  })
}

/******** midware user ********/
// 判断是否登录状态
exports.signinRequired = function(req,res, next){
  var user = req.session.user;
  if(!user){
    console.log('请您先登录！');
    return res.redirect('/signin')
  }
  next();    //当用户已登录，跳出去继续执行。否则 adminRequired 不会继续执行下去
}

// 判断登录的用户是否管理员角色
exports.adminRequired = function(req,res, next){
  var user = req.session.user;
  if(!user.role || user.role <= 10){
    console.log('对不起，您没有该访问权限！');
    return res.redirect('/signin')
  }
  next();
}