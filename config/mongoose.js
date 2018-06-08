var mongoose = require('mongoose');
var config = require("./config");
//连接mongodb数据库
mongoose.connect(config.mongodb);
exports.mongoose = mongoose