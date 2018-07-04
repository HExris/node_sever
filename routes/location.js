// 15112302796
var express = require("express");
var router = express.Router();
var day = require("dayjs");

// 引入模型
var User = require("../models/user"); // User Model
/**
 * Save location of user
 * @constructor
 * @param {Object} req - Including the location of the user.
 */

router.post("/save", async (req, res, next) => {
  console.log("Save Location");
  const { openID, latitude, longitude, desc } = req.body;

  // 
  // 保存数据
  var list = await getUserLocationList(res).catch(error => {
    console.error("Save Location Error:", error);
    res.send({ code: 400, msg: error });
  });

    // list &&
  
//   res.
});

function getUserLocationList(params) {
    
}

function insertList(params) {

}
