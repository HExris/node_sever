var express = require("express");
var router = express.Router();

// 引入模型
var User = require("../models/user"); // User Model

// Reg Rule
var { pwdReg, phoneReg, userNameReg } = require("../utils/reg");

/**
 * Login
 * @constructor
 * @param {Object} req - Including The Information of the admin user.
 */
router.post("/login", async (req, res, next) => {
    let { username, password } = req.body;

    // 获取用户
    let user = await findUserByName(username.toLowerCase(), username).catch(
        error => {
            res.send({ code: 400, data: `查找用户名错误，${error}` });
            return;
        }
    );

    if (user.result) {
        if (user.result.password === password) {
            res.send({
                code: 200,
                msg: "登录成功"
            });
            return;
        } else {
            res.send({
                code: 400,
                msg: "用户名或密码错误，请重试！"
            });
            return;
        }
    } else {
        res.send({
            code: 400,
            msg: "用户名或密码错误，请重试！"
        });
        return;
    }
});