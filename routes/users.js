var express = require("express");
var router = express.Router();

// 引入模型
var User = require("../models/user"); // User Model

// Reg Rule
var { pwdReg, phoneReg, userNameReg } = require("../utils/reg");

/**
 * Create User
 * @constructor
 * @param {Object} req - Including The Information of the user.
 */

router.post("/create", async (req, res, next) => {
  console.log("Create User");
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

// Common Methods
async function valiData(res, username, password, phone, openID, gender) {
  // 判断数据是否为空
  if (username.length < 6 || !userNameReg.test(username)) {
    res.send({ code: 400, msg: "用户名不合法" });
    return;
  } else if (!password || !pwdReg.test(password)) {
    res.send({ code: 400, msg: "密码不合法" });
    return;
  } else if (!phone || !phoneReg.test(phone)) {
    res.send({ code: 400, msg: "手机号不合法" });
    return;
  } else if (!openID) {
    res.send({ code: 400, msg: "openID不合法" });
    return;
  } else if (!gender) {
    res.send({ code: 400, msg: "性别不合法" });
    return;
  }

  // 判断用户名是否存在
  let illegalName = await findUserByName(
    username.toLowerCase(),
    username
  ).catch(error => {
    res.send({ code: 400, data: `验证用户名错误，${error}` });
    return;
  });

  // 用户名已存在抛出错误
  if (illegalName.result) {
    res.send({ code: 400, msg: `用户名：${illegalName.rawName}，已存在！` });
    return;
  }

  // 判断手机号是否被使用
  let illegalPhone = await checkPhone(phone).catch(error => {
    res.send({ code: 400, data: `验证手机号错误，${error}` });
    return;
  });

  if (illegalPhone) {
    res.send({
      code: 400,
      msg: `手机号：${illegalPhone.phone}，已绑定其他账号`
    });
    return;
  }

  // 实例化User，记录创建时间的
  var user = new User({
    username: username.toLowerCase(),
    password,
    phone,
    openID,
    gender,
    createTime: new Date().getTime()
  });

  // //验证通过返回User实例
  return user;
}

/**
 * 通过用户名查找用户
 * @constructor
 * @param {String} username - The username before toLowerCase()
 * @param {String} raw - The username
 */
function findUserByName(username, rawName) {
  return new Promise((resolve, reject) => {
    User.findOne({ username }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({ result, rawName });
      }
    });
  });
  // return User.findOne({ username });
}

// 手机号查重
function checkPhone(phone) {
  return new Promise((resolve, reject) => {
    User.findOne({ phone }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// 保存用户信息
function saveUserInfo(user, res) {
  user.save(err => {
    //添加
    console.log("save status:", err ? "failed" : "success");
    err && res.send(err);
    res && res.send({ code: 200, msg: "创建成功" });
  });
}

module.exports = router;
