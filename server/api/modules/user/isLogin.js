/**
 * === 判断用户是否登录的接口 ===
 */
// 获取公共函数
let { getCookie } = require('../../../public/mainFun');
let { judgeToken, aseEncode } = require('../../../public/crypto');

function isLogin(req, res) {
    let CQUID = req.headers.authorization; // 获取对应的 uid（从请求头部）
    // console.log(aseEncode('[1,1563851345]'));  // 从 cookie 中
    judgeToken(CQUID,data => {
        this.sendData(res,data); // 根据返回的结果进行提示
    });
};

module.exports = isLogin;