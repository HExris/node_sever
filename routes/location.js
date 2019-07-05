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

    // 验证数据
    var user = await valiData(
        res,
        username,
        password,
        phone,
        openID,
        gender
    ).catch(error => {
        console.error("valiData Error:", error);
        res.send({ code: 400, data: error });
    });
    user && saveUserInfo(user, res);
});

module.exports = router;
