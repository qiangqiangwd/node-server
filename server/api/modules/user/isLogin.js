/**
 * === 判断用户是否登录的接口 ===
 */
// 获取公共函数
let { getCookie } = require('../../../public/mainFun');
function isLogin(req, res) {
    //  进行数据库初始化
    let User = new this.cqqSql({
        name: 'user',
        notShow: ['psd', 'desc'], // 不展示数据
    });
    // let params = getQuery(req); // get 获取参数（同步获取）
    // console.log(params.d.a);

    // // post 参数为（异步获取）
    // this.getBodySysc(req, res, params => {
    //     User.select(1).then(result => {
    //         this.sendData(res, { data: result, status: false, msg: '未查询到用户' });
    //     });
    // }); // 其为异步请求

    let token = getCookie(req).token; // 获取对应的token
    if (token){}

    this.sendData(res,'返回成功！');
};

module.exports = isLogin;