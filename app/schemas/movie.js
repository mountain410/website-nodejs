//mongoose 编译模式 定义数据字段的类型
var mongoose = require('mongoose');

// 定义数据字段的类型
var MovieSchema  = new mongoose.Schema({
  doctor:String,
  title:String,
  language:String,
  country:String,
  summary:String,
  flash:String,
  poster:String,
  year:Number,
  // 录入数据、更新数据的时间
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
MovieSchema.pre('save',function(next){
  // 判断数据是更新还是新增
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else {
    this.meta.updateAt = Date.now();
  }
  next(); //让流程继续走下去
})
MovieSchema.statics = {
  // 用来取出现在数据库所有的数据
  fetch:function(cb){
    return this
    .find({})   //数据库批量查询，只需要调用模型的 find({}) 方法就行
    .sort('meta.updateAt') //按照更新时间排序
    .exec(cb) //执行回调方法
  },
  findById:function(id,cb){
    return this
    .findOne({_id:id}) //数据库单条查询就是 find({数据唯一的key}) 
    .exec(cb) //执行回调方法
  }
}
module.exports = MovieSchema;

// 这些方法需要经过模型的编译（实例化）之后，才可以用。