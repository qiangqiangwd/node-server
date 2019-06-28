/**
 *  === node.js crypto 的加密和解密
 */
const crypto = require('crypto');
// 数据库部分
const { cqqSql } = require('./database');

/*
 下面是使用加密算法对 '我不是笨蛋' 几个字进行加密，所加密使用的密码是 123456
*/
const key = 'cqq'; // 加密的密匙

// 创建加密算法
const aseEncode = function (data) {

    // 如下方法使用指定的算法与密码来创建cipher对象
    const cipher = crypto.createCipher('aes192', key);

    // 使用该对象的update方法来指定需要被加密的数据
    let crypted = cipher.update(data, 'utf-8', 'hex');

    crypted += cipher.final('hex');

    return crypted;
};

// 创建解密算法
const aseDecode = function (data) {
    /* 
     该方法使用指定的算法与密码来创建 decipher对象, 第一个算法必须与加密数据时所使用的算法保持一致;
     第二个参数用于指定解密时所使用的密码，其参数值为一个二进制格式的字符串或一个Buffer对象，该密码同样必须与加密该数据时所使用的密码保持一致
    */
    const decipher = crypto.createDecipher('aes192', key);
    try {
        /*
        第一个参数为一个Buffer对象或一个字符串，用于指定需要被解密的数据
        第二个参数用于指定被解密数据所使用的编码格式，可指定的参数值为 'hex', 'binary', 'base64'等，
        第三个参数用于指定输出解密数据时使用的编码格式，可选参数值为 'utf-8', 'ascii' 或 'binary';
        */
        let decrypted = decipher.update(data, 'hex', 'utf-8');

        decrypted += decipher.final('utf-8');
        return decrypted;
    } catch (err) { // 当解密出错时
        return false
    }

};

// 关于 CQUID 的那些判断（判断是否登录并返回相关信息）
function judgeToken(uid, callback = () => { }) {
    // 返回的参数
    let sendData = {
        status: false,
        msg: '无效的uid',
        data: null
    };
    if (!uid) return callback(sendData);

    let uidData = aseDecode(uid);
    if (!uidData) return callback(sendData);
    /**
     * 这里若 UID 解密成功，经过转化后 如：[1,10000000000]
     * 参数依次代表： 用户id、该uid生成的时间戳
     */
    //  进行数据库初始化
    let User = new cqqSql({
        name: 'user',
        notShow: ['psd', 'desc'], // 不展示数据
    });
    uidData = JSON.parse(uidData);
    User.select(uidData[0]).then(arr => {
        // console.log('获取到的用户参数：', arr, uidData);
        // 校验 uid 是否在有效期内
        let time = (new Date()).getTime(); //  获取当前时间戳
        // 设定过期时间为7天后
        let compare = time - uidData[1]; 
        if (compare > (7 * 24 * 3600000)) { 
            sendData.msg = 'uid已失效';
            return callback(sendData);
        }

        // 成功后的
        sendData.status = true;
        sendData.msg = '成功';
        sendData.data = arr[0];
        callback(sendData);
    });
}



exports.aseEncode = aseEncode; // 加密
exports.aseDecode = aseDecode; // 解密
exports.judgeToken = judgeToken; // 对是否登录的判断
