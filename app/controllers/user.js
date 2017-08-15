var User = require('../models/user'); 

// signup page
exports.signup = function(req,res) {
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
}

// signin page
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
      return res.redirect('/');
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
        console.log('password is not matched');
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