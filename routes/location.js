var express = require("express");
var router = express.Router();

/**
 * Save location of user
 * @constructor
 * @param {Object} req - Including the location of the user.
 */

router.post("/location/save", async (req, res, next) => {
    console.log("Save Location");
    const { username, password, phone, openID, gender } = req.body;

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