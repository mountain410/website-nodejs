//mongoose 编译模式 定义数据字段的类型
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

// 定义数据字段的类型
var UserSchema  = new mongoose.Schema({
  name:{
    unique:true, //唯一性
    type:String
  },
  password: String,
  // 录入数据、更新数据的时间
   // 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10: admin
  // >50: super admin
  role: {
    type: Number,
    default: 0
  },
  meta:{
    //录入数据时间
    createAt:{
      type:Date,
      default:Date.now()
    },
    //更新数据时间
    updateAt:{
      type:Date,
      default:Date.now()
    }
  }
})

// 每次存储数据之前都会经过此方法
UserSchema.pre('save',function(next){
  // 判断数据是更新还是新增
  var user = this;
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else {
    this.meta.updateAt = Date.now();
  }
  // 将密码和盐混合型加密
  /*第一个参数为计算强度，越大越复杂。
   *第二个参数回调方法可以拿到生成后的盐salt。 
   */
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)
    // hash算法 
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

// 实例方法。这是生成实例可以调用的
UserSchema.methods = {
  // _password 是用户传入的密码，this.password 是数据库的密码
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)

      cb(null, isMatch)
    })
  }
}

// 模型方法。这是模型里面直接可以调用
UserSchema.statics = {
  // 用来取出现在数据库所有的数据
  fetch:function(cb){
    return this
    .find({})                         //数据库批量查询，只需要调用模型的 find({}) 方法就行
    .sort('meta.updateAt')            //按照更新时间排序
    .exec(cb)                         //执行回调方法
  },
}
module.exports = UserSchema;

// 这些方法需要经过模型的编译（实例化）之后，才可以用。