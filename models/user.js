//models.js用来定义Model：

var mongoose = require("mongoose");
var UserSchema = require("../schemas/User");
var User = mongoose.model("User", UserSchema);

module.exports = User;