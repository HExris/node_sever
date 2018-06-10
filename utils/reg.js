const phoneReg = /^1[34578]\d{9}$/;
const userNameReg = /^[a-z0-9]+$/i;
const pwdReg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;

module.exports = {
    phoneReg,
    pwdReg,
    userNameReg,
}