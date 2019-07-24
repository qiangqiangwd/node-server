/**
 *  接口入口部分
 *  該部分会对接口的地址或其他的进行一些操作
 */
// 使用的公共参数部分
const { getQuery, getBodySysc, sendData, errorCallback } = require('../public/mainFun');
// 数据库部分
const { cqqSql } = require('../public/database');

const apiModules = require('../api/index'); // 所有接口列表

// 接口（api）部分 this 指向的对象 
const apiBindObj = {
    cqqSql: cqqSql, // 数据库封装函数
    getQuery: getQuery, // 获取 get 请求时的上传参数
    getBodySysc: getBodySysc, // 获取 post 请求时的上传参数
    sendData: sendData, // 返回参数
};

// 进行一些操作
function handle(pathname, request, response) {
    /**
    * 这里默认当为写后缀时以index为主
    */
    if (!apiModules[pathname] && !apiModules[pathname + '/index']) { // 若果请求的不是接口而是其他
        return true
    }
    // 这里可以做类似请求拦截器的操作，在请求前对所有接口做出某些操作
    //  ...
    // console.log('请求的地址：',pathname);
    errorCallback(request, response, () => {
        // 转换接口部分的 this，注意：接口js不能用箭头函数，否则bind不会生效
        apiModules[pathname].bind(apiBindObj)(request, response); // 进行接口请求
    });
    return false
}

exports.handle = handle;