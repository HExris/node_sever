var express = require("express");
var router = express.Router();

// User Model
var User = require("../models/user"); // 引入模型
// Reg Rule
var { pwdReg, phoneReg, userNameReg } = require("../utils/reg");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

/* GET users listing. */
/**
 * Create User
 * @constructor
 * @param {Object} req - The Information of the user.
 */

router.post("/create", (req, res, next) => {
  console.log("Create User");
  const { username, password, phone, openID, gender } = req.body;

  valiData(username, password, phone, openID, gender);

  // 验证数据
  async function valiData(username, password, phone, openID, gender) {
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
    
    // 判断数据是否合法
    if (await checkUserName(username.toLowerCase())) {
      res.send({ code: 303, msg: "用户名已存在" });
      return;
    } else if (await checkPhone(phone)) {
      res.send({ code: 303, msg: "已绑定其他账号" });
      return;
    }

    //保存
    saveUserInfo();
  }

  // 用户名查重
  function checkUserName(username) {
    return User.findOne({ username });
  }

  // 手机号查重
  function checkPhone(phone) {
    return User.findOne({ phone });
  }

  // 保存用户信息
  function saveUserInfo() {
    var user = new User({
      username: username.toLowerCase(),
      password,
      phone,
      openID,
      gender,
      createTime: new Date().getTime()
    });
    user.save(err => {
      //添加
      console.log("save status:", err ? "failed" : "success");
      (err && res.send(err)) || res.send({ code: 200, msg: "创建成功" });
    });
  }
});

router.post("/login", function(req, res, next) {
  // console.log(req);
  var user = new User({
    username: 111,
    password: "H.Exris19970818",
    phone: "15627692098",
    openID: "chzidsnfkioi_asdpppd",
    gender: 0
  });
  user.save(err => {
    err && console.log(err);
    if (err) {
      res.send("fail");
    } else {
      res.send("success");
    }
  });
});
module.exports = router;
