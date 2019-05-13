
/**
 *  接口入口部分
 */
// /**
// * 使用 express 创建接口
// */
// const express = require('express'),
//     app = express();

// // post 请求必须的条件
// const bodyParser = require('body-parser');
// // 创建 application/x-www-form-urlencoded 编码解析
// let urlencodedParser = bodyParser.urlencoded({ extended: false });
// app.use(urlencodedParser);
// app.use(bodyParser.json());
let user = require('../api/user'); // 用户接口部分

let handle = {
    ...user,
};

exports.handle = handle;