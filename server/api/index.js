/**
 * === 所有接口的公共调用函数 ===
 *  */
let fs = require('fs');
let join = require('path').join;

/**
 * api 文件夹存放规则：
 * 1、外部文件夹名为该部分接口模块的公共名
 * 2、文件夹内每个js文件代表一个接口，名称代表接口名字
 * 
 * 注：该部分只做接口使用，外部或其他js需另外引入
 */

let modules = {}; // 保存的所有相关api模块
const getModules = initPath => {
    let modulesFiles = {};
    // 轮循获取对应文件
    const findModules = (path, name) => {
        let files = fs.readdirSync(path);
        files.forEach(item => {
            let fPath = join(path, item); // 对地址进行转化
            let stat = fs.statSync(fPath); // 判断读取到的文件类型

            if (stat.isDirectory() === true) { // 若为文件夹
                findModules(fPath, fPath.split('\\')[fPath.split('\\').length - 1]);
            } else if (stat.isFile() === true) { // 若为文件
                // name 为当前文件夹的名称,且该文件为js
                if (name && /\.js/g.test(fPath)) {
                    // 保存每个文件夹下对应的文件
                    let pathStr = fPath.replace(/\\/g, '/');
                    // 只获取 文件夹下的文件路径 ，最后获取的格式为：{"/user/getUser": "./modules/user/getUser.js",...}
                    modulesFiles['/' + pathStr.slice(pathStr.indexOf(name), -3)] = './' + pathStr.slice(pathStr.indexOf(initPath));
                }
            }
        });
    }
    findModules(__dirname + '\\' + initPath); // 开始匹配相应的文件

    // 循环获取每个文件
    for (let item in modulesFiles){
        modules[item] = require(modulesFiles[item]);
    }
};

getModules('modules'); // 开始查询相关文件（modules 为存放接口文件的最外层文件夹名字）

module.exports = modules