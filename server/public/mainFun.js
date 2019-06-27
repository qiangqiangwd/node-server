/**
 * 存放一些公共函数的地方
 */

const url = require('url');
const querystring = require('querystring');

// 当接口发生错误时的返回错误提示
function errorCallback(req, res, callback) {
    if (!res || !req) return
    try {
        callback && callback();
    } catch (err) {
        let errorMsg
            = 'Error ' + new Date().toISOString() + ' ' + req.url + '\n'
            + err.stack || err.message || 'unknow error' + '\n';

        console.error('======== 服务发生错误 ========');
        console.error(errorMsg);
        console.error('======== 当前错误结束 ========');
        res.writeHead(500, { "Content-Type": "text/plain;charset=UTF8" });
        res.end(errorMsg);
    }
}

const mainFun = {
    // 在 get 请求时，获取链接中带的参数（同步获取）
    getQuery(req) {
        return req && req.url ? url.parse(req.url, true).query : {}
    },
    // 在 post 请求时，获取附带的参数（异步获取）
    // 1. post请求会触发"data"事件。
    // 2. chuck使用 += 保存，因为会额外请求favicon.ico，导致body = {}。
    // 3. 请求结束，会触发"end"事件。将chuck反序列化querystring.parse(body)为对象数组, 使用body.name访问post变量。
    getBodySysc(req, res, callback) {
        if (!req) return
        let body = '';

        req.on('data', chunk => {
            body += chunk;  //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
        });

        req.on('end', () => {
            // 解析参数
            body = querystring.parse(body);  //将一个字符串反序列化为一个对象

            errorCallback(req, res, () => {
                callback && callback(body);
            });
        });
    },

    // 当接口发生错误时的返回错误提示
    errorCallback(req, res, callback) {
        if (!res || !req) return
        try {
            callback && callback();
        } catch (err) {
            let errorMsg
                = 'Error ' + new Date().toISOString() + ' ' + req.url + '\n'
                + err.stack || err.message || 'unknow error' + '\n';

            console.error('======== 服务发生错误 ========');
            console.error(errorMsg);
            console.error('======== 当前错误结束 ========');
            res.writeHead(500, { "Content-Type": "text/plain;charset=UTF8" });
            res.end(errorMsg);
        }
    },

    // 接口返回的数据
    sendData(res) {
        if (!res) return

        /**
         * 返回参数 data 说明：
         * 1、status 返回的状态，true为成功，false失败 （默认 true）
         * 2、data 返回数据 （默认 null）
         * 3、message 返回的提示信息 （默认 ''）
         */
        let data = {
            status: true,
            data: null,
            msg: '',
        }; // 返回的参数
        let args = Array.prototype.slice.call(arguments); // 转化为数组
        let len = args.length; // 获取参数数组的长度

        if (len >= 2) {
            let opts = args[1]; // 获取上传的参数
            if (typeof opts === 'boolean') {
                data.status = opts;
            } else if (typeof opts === 'string') {
                data.msg = opts;
            } else if (typeof opts === 'object') {
                for (let item in opts) {
                    data[item] = opts[item]; //赋值
                };
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json', 'charset': 'utf-8' });
        // response.writeHead(200, { "Content-Type": 'text/plain', 'charset': 'utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS' });//可以解决跨域的请求
        res.end(JSON.stringify(data));
    },

    // 返回数据对应的类型
    type(opt) {
        // 获取类型+截取+转小写
        return Object.prototype.toString.apply(opt).slice(8, -1).toLowerCase()
    },

    // 获取对应浏览器的 cookie 
    getCookie(req){
        var Cookies = {};
        if (req.headers.cookie != null) {
            req.headers.cookie.split(';').forEach(l => {
                var parts = l.split('=');
                Cookies[parts[0].trim()] = (parts[1] || '').trim();
            });
        }
        return Cookies
    },
}

// exports.getQuery = getQuery;
// exports.getBodySysc = getBodySysc;
// exports.sendData = sendData;
// exports.errorCallback = errorCallback;
// exports.type = type;

// 循环返回
for (let item in mainFun){
    exports[item] = mainFun[item];
}