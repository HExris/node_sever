//创建Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var locationSchema = new Schema(
  {
    openID: String,
    locationList:[
      {
        latitude: Number,
        longitude: Number,
        country: String,
        province: String,
        city: String,
        photo: String,
        createTime: String
      }
    ]
  },
  { _id: true }
);

locationSchema.static = {
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

module.exports = locationSchema;
