/**
 *  服务器路由部分
 *  该部分主要用于各种文件的请求和判断解析
 */
const fs = require('fs');
const path = require("path");

// let visit_path = __dirname + '/src'; // 文件访问的入口
const router = {
    dirname:'', // 当前访问路径，在app.js初始时设置
    route(pathname, callback) {
        let filePath = path.join(router.dirname, pathname);  // 拼接目录路径和请求路径，组合成完整访问路径
        // 当最后一位地址为  \ 时，默认访问的文件为 index.html
        if (filePath.charAt(filePath.length - 1) === "\\") {
            filePath += 'index.html';
        }

        /**
         * 一般服务器路由使用 readFile 异步方式去读文件
         * 这样可以根据返回的错误信息做不同处理
         */
        fs.readFile(filePath, 'binary', callback);
    }
};


exports.router = router;