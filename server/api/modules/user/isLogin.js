/**
 * === 判断用户是否登录的接口 ===
 */
// 获取公共函数
let { getCookie } = require('../../../public/mainFun');
let { judgeToken } = require('../../../public/crypto');

function isLogin(req, res) {
    let CQUID = getCookie(req).CQUID; // 获取对应的 uid
    judgeToken(CQUID,data => {
        this.sendData(res,data); // 根据返回的结果进行提示
    });
};

module.exports = isLogin;