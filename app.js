
/**
 *  使用 createServer 创建 node 服务
 */
const server = require('./server/modules/server');  // 服务
const { router } = require('./server/modules/router'); // 路由

// 路由部分 文件访问的入口
router.dirname = __dirname + '/src';

// 开启服务
server.start(router.route);

