var mongoose = require("mongoose");
var CitySchema = require("../schemas/city");
var City = mongoose.model("City", CitySchema);

module.exports = City;
