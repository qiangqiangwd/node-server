
/**
 *  使用 createServer 创建 node 服务
 */
const server = require('./server/modules/server');  // 服务
const { router } = require('./server/modules/router'); // 路由

// 路由部分 静态文件访问的入口
router.dirname = __dirname + '/src';

// 开启服务
const startServer = server.start(router);

// 开启 socket 服务
const { startSocket } = require('./server/public/sockit/socket.io');
startSocket(startServer);

