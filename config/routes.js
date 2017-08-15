var _ = require('underscore');
var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user'); 

module.exports = function(app) {
  // Index 
  app.get('/', Index.index);

  // User
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/logout', User.logout)
  app.get('/admin/userlist', User.userlist)

  // Movie
  app.get('/admin/movie',Movie.new)
  app.get('/movie/:id',Movie.detail)
  app.get('/admin/update/:id',Movie.update)
  app.post('/admin/movie/new', Movie.save)
  app.get('/admin/list', Movie.list)
  app.delete('/admin/list', Movie.del)
}