var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user'); 

module.exports = function(app) {
  //pre handle user
  app.use(function(req, res, next) {
      res.locals.user = req.session.user;   // 将session中保存的用户名存储到本地变量中
      next(); 
  });

  // Index 
  app.get('/', Index.index);

  // User
  app.post('/user/signup', User.signup);
  app.post('/user/signin', User.signin);
  app.get('/logout', User.logout);
  app.get('/signup', User.showSignup);
  app.get('/signin', User.showSignin);
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist);

  // Movie
  app.get('/movie/:id',Movie.detail);
  app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.add);
  app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.save);
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);
}