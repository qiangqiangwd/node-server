/**
 *  服务器部分
 */
const http = require('http');
const url = require('url');

const { handle } = require('./requestHandlers');
const httpPort = 9091;  // 访问的端口（http 部分）
// const httpsPort = 443; //https 端口
// // https 相关证书文件的存放目录
// const httpsOption = {
//     key: fs.readFileSync('../httpsFile/2154302_qiangqiangwd.top.key'),
//     cert: fs.readFileSync('../httpsFile/2154302_qiangqiangwd.top.crt')
// }

function start(router) {
    function onRequest(request, response) {
        let pathname = url.parse(request.url, true).pathname; // 获取请求路径，解析为url对象
        // console.log('请求的路径：', pathname);
        // handle 用于判断当前请求地址为请求文件还是接口
        if (handle(pathname, request, response)){ // 当为访问文件时
            router.route(pathname, (err, fileCotent) => {
                // 路由后的回调函数
                if (err) { // 未找到文件
                    router.errorFile(response);
                    return
                }
                response.write(fileCotent, 'binary'); // 以二进制流的形式返回
                response.end();
            }); // 路由跳转
        }
    }

    // 开启 http
    http.createServer(onRequest).listen(httpPort, () => {
        console.log('http 服务已开启，地址：http://localhost:' + httpPort);
    });
    // // 开启 https
    // https.createServer(httpsOption, onRequest).listen(httpsPort, function () {
    //     console.log('https 服务已开启，地址：https://localhost:' + httpsPort);
    // });
}

exports.start = start;