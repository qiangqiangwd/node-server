
/**
 *  使用 createServer 创建 node 服务
 */
const server = require('./server/modules/server');  // 服务
const { router } = require('./server/modules/router'); // 路由

// 路由部分 静态文件访问的入口
router.dirname = __dirname + '/src';

// 开启服务
server.start(router.route);


console.log('before immediate');

setImmediate((arg) => {
    console.log(`executing immediate: ${arg}`);
}, 'so immediate');

console.log('after immediate');

