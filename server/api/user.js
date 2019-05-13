
/**
 * 用户相关接口部分
 */
// 获取公共函数
let { getQuery, getBodySysc, sendData } = require('../public/mainFun');
// 数据库部分
let { searchById } = require('../public/database');

let mainUrl = '/user/'; // 接口前缀
let user = {}; // 返回的所有接口

const userApi = {
    // 判断用户是否登录
    isLogin(req, res) {
        // let params = getQuery(req); // get 获取参数（同步获取）
        // console.log(params.d.a);
        // sendData(res);

        // post 参数为（异步获取）
        getBodySysc(req, res, params => {
            searchById(result=>{
                // console.log(params.a.b);
                sendData(res, { data: result, status: false, msg: '哈哈哈哈' });
            });
        }); // 其为异步请求
    },
}

for (let item in userApi) {
    user[mainUrl + item] = userApi[item]; // 为接口添加前缀标识
}

module.exports = user;