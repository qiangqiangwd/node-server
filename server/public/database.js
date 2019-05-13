
/**
 * 本 js 为创建 mysql 连接的地方
 * 并且会抛出些公共的方法
 */
const mysql = require('mysql');
// 当发生错误时的回调
const { type } = require('./mainFun');
/**
 * 连接数据库所需要的信息（数据库相关数据），例如：
 * dbOptions = {
 *  host: 'localhost',
 *  user: 'root',
 *  password: '123456',
 *  database: 'blog'
 * }
 *  */
let { dbOptions } = require('./mysqOptions');


function connect(sql) {
    return new Promise((resolve, reject) => {
        // 和数据库进行校验连接
        let connection = mysql.createConnection(dbOptions);
        // 创建连接
        connection.connect();

        // 查询数据
        connection.query(sql, function (err, result) {
            if (err) {
                reject(err);
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }

            resolve(result);
        });

        // 结束连接
        connection.end();
    });
}

function searchById(resBack) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT * FROM user';

        connect(sql).then(result => {
            console.log('--------------------------SELECT----------------------------');
            console.log(result);
            console.log('---------------------------end-------------------------------\n\n');

            resBack && resBack(result);
        });
    });
}

// 所有查询表格对应参数
const tableOptions = {
    user: {
        desc: 'string',
        email: 'string',
        head_img: 'string',
        id: 'number',
        last_login_time: 'number',
        name: 'string',
        psd: 'string',
        register_time: 'number',
        sex: 'number',
        status: 'number',
    },
}

/**
 *  opts 可以直接为表格的名称，代表你不含有其他的筛选条件
 *  当为对象时：
 *  1、name:想要查询的表格的名称
 *  2、notShow：不想展示的参数（字段）
 */
function cqqSql(opts = {}) {
    this.name = type(opts) === 'string' ? opts : opts.name; // 查询表格的名称

    type(opts) !== 'string' && (this.options = opts); // 若含有参数保存所有参数

    // 若存在表格名称，则进行初始化
    this.name && this.init();
}

cqqSql.prototype = {
    // 创建初始化
    init() {
        let [arr, options] = [[], (type(this.options) === 'string' || !this.options ? {} : this.options)];
        let { notShow } = options;

        for (let item in tableOptions[this.name]) {
            // notShow 表格为不想展示的字段，示例：['name','psd']
            let isAddItem = !(notShow && notShow.length > 0 && notShow.indexOf(item) > -1);

            isAddItem && arr.push(item); // 获取表格对应的参数名
        }

        this.tableData = arr;
    },
    /**
     * ====== 查询 ======
     * 可以上传两个参数：
     * 1、where部分的参数，若为数字则值获取对应id，
     *    字符串则为自定义where（不用添加where），
     *    还可为数组+对象，区别为对象只能 = ，数组可以添加 > 等其他判断（['id=1', 'sex>0']、{id:1,sex:0}）
     * 
     * 2、其他条件： 示例：{connectType: 'or', order:['id','desc'],limit:'1,2'}
     *  connectType ：where部分为 and 或 or （不支持更高级的写法）
     *  order ：数组，第一个参数为筛选字段，第二个为升序/降序(asc是表示升序，desc表示降序) 
     *  limit ：字符串，限制个数
     *  selfScreen ：字符串，其他的筛选条件，注意大写 'LIMIT 2 offset 1' ...
     */
    select() {
        // 对上传的参数进行校验
        // （添加条件部分）
        let args = [].slice.call(arguments);
        let len = args.length;
        let condition = ''; // 添加的条件
        if (len > 0) {
            // 获取 where 的判断条件时 
            condition += this._addCondition(args[0], args[1] && args[1].connectType);
            if (len === 2) { // 当有其他筛选条件时 如：升序/降序、最小/大数量...
                condition += this._addScreen(args[1]);
            }
        }

        let opts = this.tableData.join(','); // 查询内容
        let sql = `SELECT ${opts} FROM ${this.name} ${condition}`;

        return this.query(sql);
    },
    // 查询私有方法：
    // 组成判断条件 opt:要连接的数据，connectType：连接的类型 AND（默认） 和 OR
    _addCondition(opt, connectType = 'AND') {
        let _ot = type(opt); // 参数类型
        // let responseStr = '';
        // switch (_ot) {
        //     case 'number':
        //         responseStr = `id=${opt}`;
        //         break;
        //     case 'string':
        //         responseStr = opt;
        //         break;
        //     case 'array':
        //         responseStr = opt.length > 0 ? opt.join(` ${connectType.toUpperCase()} `) : '';
        //         break;
        //     case 'object':
        //         let arr = [];
        //         for (let item in opt) {
        //             arr.push(`${item}=${type(opt[item]) === 'string' ? `'${opt[item]}'` : opt[item]}`);
        //         }
        //         responseStr = arr.length > 0 ? arr.join(` ${connectType.toUpperCase()} `) : '';
        //         break;
        // }
        // return responseStr

        if (_ot === 'string') return opt.trim() ? 'WHERE ' + opt : ''; // 若為空字符串則返回全部
        return 'WHERE ' + (_ot === 'number' ? `id=${opt}` : (() => {
            let arr = _ot === 'array' ? opt : [];
            if (_ot === 'object') { // 为对象
                for (let item in opt) {
                    arr.push(`${item}=${type(opt[item]) === 'string' ? `'${opt[item]}'` : opt[item]}`);
                }
            }
            return arr.length > 0 ? arr.join(` ${connectType.toUpperCase()} `) : '';
        })());
    },
    // 添加条件
    _addScreen(screenOpt) {
        let screenList = ['order', 'limit', 'selfScreen']; // 可以添加的的方法
        let screenStr = '';
        for (let i = 0; i < screenList.length; i++) {
            let item = screenOpt[screenList[i]];
            if (!item) continue // 若参数没有，则不再执行下面方法

            if (i === 0) { // 倒叙排序
                screenStr += ` ORDER BY ${item[0]} ${item[1].toUpperCase()}`;
            } else if (item.trim() && i === 1) {  // 数量限制
                screenStr += ` LIMIT ${item.trim()}`;
            } else { // 自定义条件
                screenStr += ` ${item.trim()}`;
            }
        }
        return screenStr
    },
    /**
     * ====== 新增 ======
     * 参数可以为 数组（多条）和对象（一条）
     * 注意当为数组时输入的键值对要一致 -> 正确：[{g:1,k:2}{g:2,k:3}] 错误：[{k:2,g:1}{g:2,k:3}]
     */
    insert(opt) {
        let o_t = type(opt);
        if ((o_t !== 'object' && o_t !== 'array') || (o_t === 'array' && opt.length <= 0)) {
            return; // 当不为数组(长度大于0)或对象的时候
        }

        let sql = '';
        // Object.getOwnPropertyNames() 和 Object.keys 类似,获取对象内所有属性
        let keys = Object.keys(o_t === 'object' ? opt : opt[0]); // 想要添加数据的名称
        sql += `INSERT INTO ${this.name}(${keys.join(',')}) value ` + this.__insertSetOpt(opt, keys, o_t);

        console.log('insert生成的sql', sql);
        return this.query(sql);
    },
    // 转化要添加的数据，传入的参数：数据、类型
    __insertSetOpt(resOpt, keys, o_t) {
        let resStr = '';
        opt = o_t === 'object' ? [resOpt] : resOpt;

        for (let i = 0; i < opt.length; i++) {
            let arr = [];
            for (let j = 0; j < keys.length; j++) {
                let o = opt[i][keys[j]];
                arr.push(type(o) === 'string' ? `"${o}"` : o); // 若为字符串则添加上引号
            }
            resStr += `(${arr.join(',')}),`;
        }

        return resStr.slice(0, -1); // 去除最后一个逗号
    },

    // 创建一次连接并进行对应的数据库操作
    query(sql) {
        console.log(sql);
        return new Promise((resolve, reject) => {
            // 和数据库进行校验连接
            let connection = mysql.createConnection(dbOptions);
            // 创建连接
            connection.connect();

            // 查询数据
            connection.query(sql, function (err, result) {
                if (err) {
                    console.log('--------------------------数据库错误提示（' + new Date() + '）：----------------------------');
                    console.log(err.message);
                    console.log('---------------------------end-------------------------------\n\n');
                    reject(err);
                    return;
                }
                resolve(result);
            });

            // 结束连接
            connection.end();
        });
    },
}

let User = new cqqSql({
    name: 'user',
    notShow: ['psd', 'desc'], // 不展示数据
});

let optReqww = {
    email: '12306@main.com',
    psd: 987654321,
    head_img: 'https://pic.cnblogs.com/face/u390726.png?id=16111932',
    register_time: 11111111,
    name: '测试添加',
}
let arr = [];
for (let i = 0; i < 3; i++) {
    arr.push({
        email: '12306@main.com',
        psd: 987654321,
        head_img: 'https://pic.cnblogs.com/face/u390726.png?id=16111932',
        register_time: 11111111,
        name: '测试添加' + i,
    });
}

// // 新增操作
// User.insert(optReqww).then(res1 => {
// });

User.select('').then(res => {
    console.log('select查询结果：', res);
});

// User.query("SELECT email,head_img,id,last_login_time,name,register_time,sex,status FROM user WHERE id=1 OR sex=0 ORDER BY id ASC").then(res => {
//     console.log('query查询结果：', res);
// });
// INSERT INTO 表名 （字段名1，字段名2，...）
// VALUES(值1，值2，...);

exports.connect = connect;
exports.searchById = searchById;
