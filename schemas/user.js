//创建Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    nickName: String,
    password: String,
    country: String,
    province: String,
    city: String,
    language: String,
    avatar: String,
    phone: Number,
    openID: String,
    gender: Number,
    createTime: Number
  },
  { _id: true }
);

userSchema.static = {
  fetch: function(cb) {
    return this.find({}).exec(cb);
  },
  findByName: function(name, cb) {
    return this.findOne({ name: name }).exec(cb);
  },
  findByl56: function(l56, cb) {
    return this.find({ l56: l56 }).exec(cb);
  }
};

module.exports = userSchema;
