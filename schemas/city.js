var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CitySchema = new Schema({
    _id: Number,
    name: String,
    pname: String,
    l56: String
})

CitySchema.static = {
    fetch: function (cb) {
        return this.find({}).exec(cb);
    },
    findByName: function (name, cb) {
        return this.findOne({ name: name }).exec(cb);
    },
    findByl56: function (l56, cb) {
        return this.find({ l56: l56 }).exec(cb);
    }
};

module.exports = CitySchema;