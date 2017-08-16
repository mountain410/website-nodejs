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
  var _user = req.body.user;//这是取得name=user[pwd]
  User.findOne({name: _user.name}, function(err,user){
    if (err) {
      console.log(err);
    }
    if(user) {
      return res.redirect('/signin');
      // console.log('用户名已存在！')
    }else {
      var user = new User(_user);
      user.save(function (err,user) {
        if(err) {
          console.log(err);
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
      console.log(err);
    }
    // 如果用户不存在，直接返回首页
    if (!user) {
      return res.redirect('/signup');
    }
    // 如果用户存在，拿到用户密码（解密后）
    user.comparePassword(password, function(err, isMatch){
      if (err) {
        console.log(err);
      }
      if(isMatch){
        req.session.user = user
        return res.redirect('/')
      }else {
        return res.redirect('/signin');
        console.log('password is not matched');
        alert('密码不对')
        // return res.redirect('/')
        
      }
    })
  })
}

// logout page
exports.logout = function(req, res) {
  delete req.session.user;
  res.redirect('/')
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

// midware user
exports.signinRequired = function(req,res, next){
  var user = req.session.user;
  
  if(!user){
    return res.redirect('/signin')
  }
  next();
}

exports.adminRequired = function(req,res, next){
  var user = req.session.user;
  
  if(!user.role || user.role <= 10){
    console.log('对不起，您没有该访问权限！');
    return res.redirect('/signin')
  }
  next();
}