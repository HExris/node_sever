var express = require("express");
var router = express.Router();
var http = require("axios");
var day = require("dayjs");

// 引入配置文件
var config = require("../config/config");
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
    return;
  });
  user && saveUserInfo(user, res);
});

/**
 * Get openID
 * @constructor
 * @param {Object} req - Including The Information of the wechat user.
 */

router.post("/login", async (req, res, next) => {
  let { code, userInfo } = req.body;

  const appid = config.appId;
  const appSecret = config.appSecret;

  http({
    url: "https://api.weixin.qq.com/sns/jscode2session",
    method: "GET",
    params: {
      appid: appid,
      secret: appSecret,
      js_code: code,
      grant_type: "authorization_code"
    }
  }).then(result => {
    result = result.data;
    if (result.errcode || !result.openid || !result.session_key) {
      throw new Error(
        `${ERRORS.ERR_GET_SESSION_KEY}\n${JSON.stringify(result)}`
      );
    } else {
      let {
        nickName,
        country,
        province,
        city,
        language,
        avatarUrl,
        gender
      } = userInfo;
      let openID = result.openid;

      var user = { nickName, country, province, city, language, avatar: avatarUrl, phone: null, openID, gender, createTime: day().format("YYYY-MM-DD HH:mm:ss") };
      CreateUserByOpenID(openID, user).catch(err => {
        console.error(err);
      });

      res.send({ code: 200, msg: "获取openID成功", data: result.openid });
      return;
    }
  });
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
 * @param {String} rawName - The username
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
}

/**
 * 通过openID创建并更新用户
 * @constructor
 * @param {String} openID - The openID of user
 */
function CreateUserByOpenID(openID, user) {
  return new Promise((resolve, reject) => {
    User.updateOne(
      { openID },
      { $set: user },
      {
        upsert: true,
        multi: false
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/**
 * 手机号查重
 * @constructor
 * @param {Number} phone - Phone of the user
 */
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
